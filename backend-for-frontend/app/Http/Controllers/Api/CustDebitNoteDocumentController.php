<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustDebitNoteDocumentStoreRequest;
use App\Http\Requests\CustDebitNoteDocumentUpdateRequest;
use App\Http\Resources\CustDebitNoteDocumentResource;
use App\Models\CustDebitNote;
use App\Models\CustDebitNoteDocument;
use App\Services\CustDebitNoteDocumentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CustDebitNoteDocumentController extends Controller
{
    public function __construct(private CustDebitNoteDocumentService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', CustDebitNoteDocument::class);

        return CustDebitNoteDocumentResource::collection($this->service->index(
            $request->except('per_page', 'page'),
            max(1, (int) $request->get('per_page', 15)),
            max(1, (int) $request->get('page', 1))
        ));
    }

    public function store(CustDebitNoteDocumentStoreRequest $request)
    {
        $this->authorize('create', CustDebitNoteDocument::class);
        $note = CustDebitNote::findOrFail($request->validated('debit_note_id'));
        abort_if($note->status !== 'draft', 422, 'Raised debit note documents cannot be modified.');
        $file = $request->file('document_file');
        $path = $file->store('cust-debit-note-documents', 'public');
        $data = [
            'debit_note_id' => $note->id,
            'document_name' => $file->getClientOriginalName(),
            'document_path' => $path,
            'created_by' => Auth::id(),
        ];
        try {
            $document = $this->service->create($data);
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($path);
            throw $exception;
        }

        return new CustDebitNoteDocumentResource($document);
    }

    public function show(CustDebitNoteDocument $custDebitNoteDocument)
    {
        $this->authorize('view', $custDebitNoteDocument);

        return new CustDebitNoteDocumentResource($this->service->find($custDebitNoteDocument->id));
    }

    public function update(CustDebitNoteDocumentUpdateRequest $request, CustDebitNoteDocument $custDebitNoteDocument)
    {
        $this->authorize('update', $custDebitNoteDocument);
        abort_if($custDebitNoteDocument->debitNote->status !== 'draft', 422, 'Raised debit note documents cannot be modified.');
        $data = ['updated_by' => Auth::id()];
        $newPath = null;
        $oldPath = $custDebitNoteDocument->document_path;

        if ($request->hasFile('document_file')) {
            $file = $request->file('document_file');
            $newPath = $file->store('cust-debit-note-documents', 'public');
            $data['document_name'] = $file->getClientOriginalName();
            $data['document_path'] = $newPath;
        }
        try {
            $updated = $this->service->update($custDebitNoteDocument, $data);
        } catch (\Throwable $exception) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }
            throw $exception;
        }
        if ($newPath && $oldPath !== $newPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return new CustDebitNoteDocumentResource($updated);
    }

    public function destroy(CustDebitNoteDocument $custDebitNoteDocument)
    {
        $this->authorize('delete', $custDebitNoteDocument);
        $path = $custDebitNoteDocument->document_path;
        $this->service->delete($custDebitNoteDocument, Auth::id());
        if ($path) {
            Storage::disk('public')->delete($path);
        }

        return response()->noContent();
    }

    public function download(CustDebitNoteDocument $custDebitNoteDocument)
    {
        $this->authorize('view', $custDebitNoteDocument);
        $disk = Storage::disk('public');
        if (! $custDebitNoteDocument->document_path || ! $disk->exists($custDebitNoteDocument->document_path)) {
            return response()->json(['message' => 'Document file not found'], 404);
        }

        return $disk->download($custDebitNoteDocument->document_path, $custDebitNoteDocument->document_name);
    }
}
