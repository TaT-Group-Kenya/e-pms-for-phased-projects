#!/usr/bin/env python3
import os, re, json
from pathlib import Path

root = Path.cwd()
req_dir = root / 'app' / 'Http' / 'Requests'
models_dir = root / 'app'
routes_file = root / 'routes' / 'api.php'

# Helpers
rule_type_map = [
    ('integer', 'integer'),
    ('numeric', 'number'),
    ('numeric:', 'number'),
    ('boolean', 'boolean'),
    ('date_format', 'string'),
    ('date', 'string'),
    ('email', 'string'),
    ('url', 'string'),
    ('array', 'array'),
]

def infer_type(rules_str):
    r = rules_str.lower()
    for key, t in rule_type_map:
        if key in r:
            return t
    return 'string'

# Parse routes to get apiResource paths
routes = {}
if routes_file.exists():
    text = routes_file.read_text()
    for m in re.finditer(r"Route::apiResource\('([^']+)',\s*([^:]+)::class\)", text):
        path = m.group(1)
        controller = m.group(2).strip().split('\\')[-1]
        routes[path] = controller

# Parse Requests
requests = {}
if req_dir.exists():
    for p in req_dir.glob('**/*.php'):
        name = p.name
        classbase = name.replace('.php','')
        content = p.read_text()
        # find rules() return array
        m = re.search(r'public function rules\(\)\s*:\s*array\s*\{|public function rules\(\)\s*\{', content)
        rules_block = None
        if m:
            # find "return [" after this position
            start = content.find('return', m.end())
            if start!=-1:
                rb_start = content.find('[', start)
                if rb_start!=-1:
                    # naive bracket match
                    i = rb_start
                    depth = 0
                    for j in range(rb_start, len(content)):
                        if content[j]=='[':
                            depth+=1
                        elif content[j]==']':
                            depth-=1
                            if depth==0:
                                rules_block = content[rb_start:j+1]
                                break
        if not rules_block:
            # try to find $this->validate(...) or inline arrays
            rules_block = None
        fields = {}
        if rules_block:
            # find 'field' => 'rules' or "field" => ['r','s']
            for fm in re.finditer(r"['\"]([A-Za-z0-9_\\.]+)['\"]\s*=>\s*([^,\n]+)", rules_block):
                fld = fm.group(1)
                val = fm.group(2).strip()
                # clean val
                val_clean = val.replace('array(','[').replace(')',']')
                # join if pipe separated
                if '|' in val_clean and val_clean.count('\'')==0:
                    rulestr = val_clean
                else:
                    rulestr = val_clean
                fields[fld]=infer_type(rulestr)
        requests[classbase]=fields

# Parse Models $fillable
models = {}
for p in (root / 'app').glob('*.php'):
    # only top-level models
    if p.name in ('User.php',) or p.suffix=='.php':
        content = p.read_text()
        m = re.search(r'protected\s+\$fillable\s*=\s*\[([^\]]*)\]', content, re.S)
        if m:
            inner = m.group(1)
            cols = [x.strip().strip("'\"") for x in re.findall(r"['\"]([^'\"]+)['\"]", inner)]
            models[p.stem]=cols

# Fallback: list models in app/Models
for p in (root / 'app' / 'Models').glob('*.php') if (root / 'app' / 'Models').exists() else []:
    content = p.read_text()
    m = re.search(r'protected\s+\$fillable\s*=\s*\[([^\]]*)\]', content, re.S)
    if m:
        inner = m.group(1)
        cols = [x.strip().strip("'\"") for x in re.findall(r"['\"]([^'\"]+)['\"]", inner)]
        models[p.stem]=cols

# Build OpenAPI
openapi = {
    "openapi":"3.0.0",
    "info":{
        "title":"e-pms API",
        "version":"1.0.0",
        "description":"Auto-generated OpenAPI from Requests and Models"
    },
    "servers":[{"url":"/api"}],
    "paths":{},
    "components":{"schemas":{}}
}

# For each route, build path object
for path, controller in routes.items():
    # derive resource name singular
    # path like account-types -> AccountType
    seg = path.split('/')[-1]
    base = ''.join([part.capitalize() for part in re.split('[-_]', seg)])
    schema_name = base
    create_schema = schema_name + 'Create'
    update_schema = schema_name + 'Update'

    # find corresponding request classes
    store_request = base + 'StoreRequest'
    update_request = base + 'UpdateRequest'
    store_fields = requests.get(store_request, {})
    update_fields = requests.get(update_request, {})

    # fallback to model fillable
    model_fill = models.get(schema_name, [])

    # compose schema properties
    props = {}
    for f in model_fill:
        props[f] = {"type":"string"}
    for f,t in store_fields.items():
        props[f] = {"type": t}
    # set created/updated
    props.setdefault('id',{"type":"integer"})
    props.setdefault('created_at',{"type":"string","format":"date-time"})
    props.setdefault('updated_at',{"type":"string","format":"date-time"})

    openapi['components']['schemas'][schema_name]= {"type":"object","properties":props}
    openapi['components']['schemas'][create_schema] = {"type":"object","properties":{k:{"type":v} for k,v in [(k,req_type.get('type') if isinstance(req_type, dict) else (v)) for k,v in [(kk, ("string" if not isinstance(store_fields.get(kk), str) else store_fields.get(kk)) ) for kk in store_fields]]}}
    # simpler: use store_fields
    openapi['components']['schemas'][create_schema] = {"type":"object","properties":{k:{"type":v} for k,v in store_fields.items()}}
    openapi['components']['schemas'][update_schema] = {"type":"object","additionalProperties":True}

    # paths
    p_base = '/' + path
    openapi['paths'][p_base] = {
        "get":{
            "tags":[seg],
            "summary":f"List {seg}",
            "responses":{
                "200":{
                    "description":"OK",
                    "content":{"application/json":{"schema":{"type":"array","items":{"$ref":f"#/components/schemas/{schema_name}"}}}}
                }
            }
        },
        "post":{
            "tags":[seg],
            "summary":f"Create {schema_name}",
            "requestBody":{"required":True,"content":{"application/json":{"schema":{"$ref":f"#/components/schemas/{create_schema}"}}}},
            "responses":{"201":{"description":"Created","content":{"application/json":{"schema":{"$ref":f"#/components/schemas/{schema_name}"}}}}}
        }
    }
    openapi['paths'][p_base + '/{id}'] = {
        "parameters":[{"name":"id","in":"path","required":True,"schema":{"type":"integer"}}],
        "get":{"tags":[seg],"summary":f"Get {schema_name}","responses":{"200":{"description":"OK","content":{"application/json":{"schema":{"$ref":f"#/components/schemas/{schema_name}"}}}}}},
        "put":{"tags":[seg],"summary":f"Replace {schema_name}","requestBody":{"required":True,"content":{"application/json":{"schema":{"$ref":f"#/components/schemas/{create_schema}"}}}},"responses":{"200":{"description":"OK","content":{"application/json":{"schema":{"$ref":f"#/components/schemas/{schema_name}"}}}}}},
        "patch":{"tags":[seg],"summary":f"Update {schema_name}","requestBody":{"required":True,"content":{"application/json":{"schema":{"$ref":f"#/components/schemas/{update_schema}"}}}},"responses":{"200":{"description":"OK","content":{"application/json":{"schema":{"$ref":f"#/components/schemas/{schema_name}"}}}}}},
        "delete":{"tags":[seg],"summary":f"Delete {schema_name}","responses":{"204":{"description":"No Content"}}}
    }

# write file
out = root / 'public' / 'swagger-ui' / 'openapi.json'
out.write_text(json.dumps(openapi, indent=2))
print('WROTE', out)
