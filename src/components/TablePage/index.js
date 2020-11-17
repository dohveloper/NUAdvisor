import React, { useContext, useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter, useSortBy } from 'react-table';
import { DataContext } from '../App';
import Toolbar from './Toolbar';
import './TablePage.scss';
import { COLUMNS } from './columns';
import { getClassCombinationsByStudentId } from '../nuadvisor';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function TablePage() {
  //let { data } = useContext(DataContext);
  //let students = data ? data.students : [];
  //let classCombinations = getClassCombinationsByStudentId(data, data.students[0].id, 5);

  //test
  let rowsTest = [
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hello', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' },
    { major: 'IT', name: 'hi', id: '1212121', email: 'email@email.com' }
  ];
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => rowsTest, []);

  const tableInstance = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter
  } = tableInstance;
  const { pageIndex, pageSize, globalFilter } = state;
  return (
    <div className="table__page">
      <Toolbar filter={globalFilter} setFilter={setGlobalFilter} />
      <table class="table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th class="table__header" {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>{column.isSorted ? column.isSortedDesc ? <FaSortDown /> : <FaSortUp /> : <FaSort />}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td scope="table__row" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div class="table__footer">
        <div class="table__footerLeft">
          <select name="cars" id="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="table__footerRight">
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(pageNumber);
              }}
              style={{ width: '50px' }}
            />
          </span>
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            {[10, 25, 50].map(pageSize => {
              return (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              );
            })}
          </select>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TablePage;
