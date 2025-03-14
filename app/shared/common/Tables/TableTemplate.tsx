'use client';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';

interface TableTemplateProps {
  rowData: any[];
  colDefs: GridColDef[];
  pageSize?: number;
  loading?: boolean;
  enableSelection?: boolean;
  selectionMode?: 'singleRow' | 'multiRow';
  // eslint-disable-next-line no-unused-vars
  isRowSelectable?: (params: any) => boolean;
  // eslint-disable-next-line no-unused-vars
  onSelectionChanged?: (selectionModel: GridRowSelectionModel) => void;
  height?: number;
}

export default function TableTemplate({
  rowData,
  colDefs,
  pageSize = 20,
  loading = false,
  enableSelection = false,
  selectionMode = 'multiRow',
  isRowSelectable,
  onSelectionChanged,
  height = 635,
  getRowId, // Nueva prop
}: TableTemplateProps & { getRowId?: (row: any) => string | number }) {
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className='w-full' style={{ height: height || 635 }}>
      <DataGrid
        rows={rowData}
        columns={colDefs}
        pageSizeOptions={[pageSize]}
        checkboxSelection={enableSelection}
        disableRowSelectionOnClick
        onRowSelectionModelChange={enableSelection ? onSelectionChanged : undefined}
        isRowSelectable={isRowSelectable}
        rowSelectionModel={selectionMode === 'singleRow' ? 'single' : 'multiple'}
        getRowId={getRowId} // Se define dinámicamente
        className='bg-white shadow-md rounded-lg border'
      />
    </div>
  );
}
