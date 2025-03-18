'use client';

import { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';

interface TableTemplateProps {
  rowData: any[];
  colDefs: GridColDef[];
  pageSize?: number;
  loading?: boolean;
  enableSelection?: boolean;
  selectionMode?: 'singleRow' | 'multiRow';
  isRowSelectable?: (params: any) => boolean;
  onSelectionChanged?: (selectionModel: GridRowSelectionModel) => void;
  height?: number;
  getRowId?: (row: any) => string | number;
}

export default function TableTemplate({
  rowData,
  colDefs,
  pageSize = 20,
  loading = false,
  enableSelection = false,
  isRowSelectable,
  onSelectionChanged,
  height = 635,
  getRowId,
}: TableTemplateProps) {
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRows(selection);
    if (onSelectionChanged) {
      onSelectionChanged(selection);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className='w-full' style={{ height }}>
      <DataGrid
        rows={rowData}
        columns={colDefs.map((col) => ({
          ...col,
          flex: 1,
          minWidth: 100,
        }))}
        pageSizeOptions={[pageSize]}
        checkboxSelection={enableSelection}
        disableRowSelectionOnClick
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={enableSelection ? handleSelectionChange : undefined}
        isRowSelectable={isRowSelectable}
        getRowId={getRowId}
        className='bg-white shadow-md rounded-lg border'
      />
    </div>
  );
}
