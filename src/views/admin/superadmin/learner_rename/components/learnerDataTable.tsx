import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, TableInstance } from 'react-table';

// Chakra imports
import {
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
} from '@chakra-ui/react';
import Card from 'components/card/Card';

type RowObj = {
  sNo: number;
  creatorName: string;
  learnerName: string;
  learnerMail: string;
  cohorts: any;
  status: any;
  addGame: any;
  action: any;
};

interface ColumnObj {
  Header: number | string;
  accessor: keyof RowObj;
}

interface CreatorDataTableProps {
  data: RowObj[];
}

type DataCol = TableInstance<RowObj>;

const CreatorDataTable: React.FC<CreatorDataTableProps> = ({ data }) => {
  const [lastPage, setLastPage] = useState<any>();

  const columns: ColumnObj[] = React.useMemo(
    () => [
      { Header: 'S.No', accessor: 'sNo' },
      { Header: 'Creator Name', accessor: 'creatorName' },
      { Header: 'learner Name', accessor: 'learnerName' },
      { Header: 'learner Mail', accessor: 'learnerMail' },
      { Header: 'Cohorts', accessor: 'cohorts' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Add Game', accessor: 'addGame' },
      { Header: 'Action', accessor: 'action' },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    gotoPage,
    setPageSize,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  }: DataCol = useTable<RowObj>(
    {
      columns,
      data: data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    const lastPage = Math.floor(data.length / pageSize);
    setLastPage(Math.floor(data.length / pageSize));
  }, []);

  return (
    <>
      <Input
        type="text"
        placeholder="Search"
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
          </strong>{' '}
        </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<< '}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(Math.max(0, lastPage - 1))} disabled={!canNextPage}>
          {' >>'}
        </button>{' '}
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '50px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default CreatorDataTable;
