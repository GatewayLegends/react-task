import TablePagination from "./TablePagination";
import { useTable, usePagination } from "react-table";
import TableContentData from "./TableContentData";
import { ContentClasses, TitleClasses } from "./TableClassServices";
import { useSelector } from "react-redux";
import { COLUMNS } from "./columns.js";
import { useMemo } from "react";
import moment from "moment";
export default function Table() {
  const DATA = useSelector((state) => state.data);
  const filters = useSelector((state) => state.filters);
  const columns = useMemo(() => COLUMNS, []);

  const data = useMemo(() => {
    let temp = DATA;

    if (filters.text && filters.text !== "") {
      temp = temp.filter(
        (el) =>
          el.name.toLowerCase().includes(filters.text.toLowerCase()) ||
          el.createdBy.toLowerCase().includes(filters.text.toLowerCase())
      );
    }

    if (filters.startDate && filters.endDate) {
      console.log();
      temp = temp.filter((el) =>
        moment(moment(el.configuredAt, "DD-MM-YYYY")).isBetween(
          moment(filters.startDate, "DD-MM-YYYY"),
          moment(filters.endDate, "DD-MM-YYYY")
        )
      );
    }
    return temp;
  }, [filters]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageSize: 7 } },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
    state,
  } = tableInstance;
  const { pageIndex } = state;
  return (
    <div>
      <table className="mt-6 w-full border-separate" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <th
                  className={`text-base font-normal bg-customtableheading1 border border-semiBlack first:rounded-tl-lg last:rounded-tr-lg 
                  ${TitleClasses(column.id)} 
                  ${idx === 0 ? "" : "border-l-0"}
                  `}
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, idx) => {
                  return (
                    <td
                      className={`p-3 align-top border border-t-0 text-base font-normal border-semiBlack 
                      ${ContentClasses(cell.column.id)} 
                      ${
                        index === data.length - 1
                          ? "first:rounded-bl-lg last:rounded-br-lg"
                          : ""
                      } 
                      ${idx === 0 ? "" : "border-l-0"}
                    `}
                      {...cell.getCellProps()}
                    >
                      {TableContentData(cell)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className=" my-3 text-center w-full">
          No Data Available <br /> Remove Filters or reload the web
        </div>
      )}
      <br />
      {data.length !== 0 && (
        <TablePagination
          count={pageCount}
          canNext={canNextPage}
          current={pageIndex}
          go={gotoPage}
          canBack={canPreviousPage}
        />
      )}
    </div>
  );
}
