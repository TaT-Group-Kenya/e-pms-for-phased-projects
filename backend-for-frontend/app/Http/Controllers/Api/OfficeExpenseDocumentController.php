<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\OfficeExpenseDocument;
use App\Models\OfficeExpense;
use App\Services\OfficeExpenseDocumentService;
use App\Http\Resources\OfficeExpenseDocumentResource;
use App\Http\Requests\OfficeExpenseDocumentStoreRequest;
use App\Http\Requests\OfficeExpenseDocumentUpdateRequest;

class OfficeExpenseDocumentController extends Controller
{
    protected $service;

    public function __construct(OfficeExpenseDocumentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\OfficeExpenseDocument::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OfficeExpenseDocumentResource::collection($data);
    }

    public function store(OfficeExpenseDocumentStoreRequest $request)
    {
        $this->authorize('create', \App\Models\OfficeExpenseDocument::class);
        
        $validated = $request->validated();

        if (!empty($validated['expense_id'])) {
          $expense = OfficeExpense::findOrFail($validated['expense_id']);
          if ($expense->status === 'paid') {
              return response()->json([
                  'message' => 'Documents cannot be added to a paid expense.',
                  'errors'  => [
                      'expense_id' => ['This expense is paid and locked for changes.'],
                  ],
              ], 422);
          }
        }

        if ($request->hasFile('document_file')) {
            $file = $request->file('document_file');

            $expense = isset($validated['expense_id'])
                ? OfficeExpense::findOrFail($validated['expense_id'])
                : null;

            $originalName = $file->getClientOriginalName();
            $prefix = $expense ? 'expense-' . $expense->id : 'expense';
            $fileName = $prefix . '-' . $originalName;

            $path = $file->storeAs('office-expense-documents', $fileName, 'public');
            $validated['document_path'] = $path;
        }

        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new OfficeExpenseDocumentResource($model);
    }

    public function show(OfficeExpenseDocument $officeExpenseDocument)
    {
        $this->authorize('view', $officeExpenseDocument);

        return new OfficeExpenseDocumentResource($officeExpenseDocument);
    }

    public function update(OfficeExpenseDocumentUpdateRequest $request, OfficeExpenseDocument $officeExpenseDocument)
    {
        $this->authorize('update', $officeExpenseDocument);

        $expense = $officeExpenseDocument->expense ?? OfficeExpense::find($officeExpenseDocument->expense_id);
        if ($expense && $expense->status === 'paid') {
            return response()->json([
                'message' => 'Documents on a paid expense cannot be edited.',
                'errors'  => [
                    'expense_id' => ['This expense is paid and locked for changes.'],
                ],
            ], 422);
        }

        $validated = $request->validated();

        if ($request->hasFile('document_file')) {
            // Remove the previous file from storage if it exists
            if ($officeExpenseDocument->document_path && Storage::disk('public')->exists($officeExpenseDocument->document_path)) {
                Storage::disk('public')->delete($officeExpenseDocument->document_path);
            }

            $file = $request->file('document_file');

            $expense = $officeExpenseDocument->expense ?? OfficeExpense::findOrFail($officeExpenseDocument->expense_id);

            $originalName = $file->getClientOriginalName();
            $prefix = $expense ? 'expense-' . $expense->id : 'expense';
            $fileName = $prefix . '-' . $originalName;

            $path = $file->storeAs('office-expense-documents', $fileName, 'public');
            $validated['document_path'] = $path;
        }
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($officeExpenseDocument->id, $validated);
        return new OfficeExpenseDocumentResource($updated);
    }

    public function destroy(OfficeExpenseDocument $officeExpenseDocument)
    {
        $this->authorize('delete', $officeExpenseDocument);

        $expense = $officeExpenseDocument->expense ?? OfficeExpense::find($officeExpenseDocument->expense_id);
        if ($expense && $expense->status === 'paid') {
            return response()->json([
                'message' => 'Documents on a paid expense cannot be deleted.',
                'errors'  => [
                    'expense_id' => ['This expense is paid and locked for changes.'],
                ],
            ], 422);
        }

        // Delete the file from storage if it exists
        if ($officeExpenseDocument->document_path && Storage::disk('public')->exists($officeExpenseDocument->document_path)) {
            Storage::disk('public')->delete($officeExpenseDocument->document_path);
        }

        $this->service->delete($officeExpenseDocument->id);
        return response()->noContent();
    }

    public function download(OfficeExpenseDocument $officeExpenseDocument)
    {
        $this->authorize('view', $officeExpenseDocument);

        if (!$officeExpenseDocument->document_path) {
            return response()->json(['message' => 'Document file not found'], 404);
        }

        $disk = \Illuminate\Support\Facades\Storage::disk('public');

        if (!$disk->exists($officeExpenseDocument->document_path)) {
            return response()->json(['message' => 'Document file missing on server'], 404);
        }

        $filename = basename($officeExpenseDocument->document_path);

        return $disk->download($officeExpenseDocument->document_path, $filename);
    }
}
