// @flow

import React, { Fragment } from 'react';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

type Props = {
  data: Array<Object>,
  pages?: number,
  defaultPageSize?: number,
  defaultFilterMethod?: Function,
  manual?: boolean,
};

function filterCaseInsensitive(filter, row) {
  const id = filter.pivotId || filter.id;
  return row[id] !== undefined
    ? String(row[id].toLowerCase()) === filter.value.toLowerCase()
    : true;
}

const Table = ({
  data,
  defaultPageSize = 10,
  pages,
  defaultFilterMethod = filterCaseInsensitive,
  manual,
  ...rest
}: Props) => {
  const calcPages = Math.ceil(data.length / defaultPageSize);
  return (
    <Fragment>
      <style>{`
        .rt-resizable-header:focus {
          outline:0;
        }
      `}</style>
      <ReactTable
        data={data}
        pages={manual && pages}
        manual={manual}
        defaultPageSize={
          data.length < defaultPageSize ? data.length : defaultPageSize
        }
        showPagination={pages ? pages > 1 : calcPages > 1}
        defaultFilterMethod={defaultFilterMethod}
        {...rest}
      />
    </Fragment>
  );
};

export default Table;
