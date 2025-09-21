import { Table } from 'antd';
import React, { useMemo, useState } from 'react'
import Loading from '../LoadingComponent/Loading';
import { Excel } from 'antd-table-saveas-excel';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data: dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])

    const newColumnsExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== 'action')
        return arr
    }, [columns])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },

    };

    const handleDeleteAll = () => {
        if (handleDeleteMany) {
            handleDeleteMany(rowSelectedKeys);
        }
    };

    const handleClick = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newColumnsExport)
            .addDataSource(dataSource, {
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    };


    return (
        <Loading isLoading={isLoading}>
            {rowSelectedKeys.length > 0 && (
                <div style={{
                    background: '#E30019',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
                    onClick={handleDeleteAll}>
                    Xóa tất cả
                </div>
            )}
            <button onClick={handleClick}>Export</button>
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </Loading>

    )
}

export default TableComponent