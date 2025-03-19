'use client';

import { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridPaginationModel } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { CircularProgress } from '@mui/material';

interface DataTableProps {
  rowData: any[];
  colDefs: GridColDef[];
  pageSize?: number;
  loading?: boolean;
  enableSelection?: boolean;
  // eslint-disable-next-line no-unused-vars
  isRowSelectable?: (params: any) => boolean;
  // eslint-disable-next-line no-unused-vars
  onSelectionChanged?: (selectionModel: GridRowSelectionModel) => void;
  height?: number;
  // eslint-disable-next-line no-unused-vars
  getRowId?: (row: any) => string | number;
}

export default function DataTable({
  rowData,
  colDefs,
  pageSize = 20,
  loading = false,
  enableSelection = false,
  isRowSelectable,
  onSelectionChanged,
  height = 635,
  getRowId,
}: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize,
  });

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
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50, 100]}
        checkboxSelection={enableSelection}
        disableRowSelectionOnClick
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={enableSelection ? handleSelectionChange : undefined}
        isRowSelectable={isRowSelectable}
        getRowId={getRowId}
        className='bg-white shadow-md rounded-lg border'
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      />
    </div>
  );
}