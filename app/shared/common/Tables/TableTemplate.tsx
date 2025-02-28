'use client';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef, IRowNode } from 'ag-grid-community';

interface TableTemplateProps {
  rowData: any[];
  colDefs: ColDef[];
  pageSize?: number;
  loading?: boolean;
  enableSelection?: boolean;
  selectionMode?: 'singleRow' | 'multiRow';
  // eslint-disable-next-line no-unused-vars
  isRowSelectable?: (rowNode: IRowNode<any>) => boolean;
  // eslint-disable-next-line no-unused-vars
  onSelectionChanged?: (params: any) => void;
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
}: TableTemplateProps) {
  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      }}
      >
        <div>Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className='ag-theme-quartz' style={{ height: height || 635, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination
        paginationPageSize={pageSize}
        selection={enableSelection ? {
          mode: selectionMode,
          isRowSelectable,
          checkboxes: true,
        } : undefined}
        onSelectionChanged={enableSelection ? onSelectionChanged : undefined}
      />
    </div>
  );
}
