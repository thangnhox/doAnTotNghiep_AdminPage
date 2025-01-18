import { Button, message, Modal, Select, Table, TableProps, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { ResponseDTO } from '../../../dtos/Response/ResponseDTO'
import { handleAPI } from '../../../remotes/apiHandle'
import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { BookRequested } from '../../../models/BookRequested'
import { debounceSearch } from '../../../utils/debouce'
import Book from '../../../models/book/Book'

const BookRequestedPage = () => {

    const [isLoading, setLoading] = useState<boolean>(false)
    const [requestedBookList, setRequestedBookList] = useState<BookRequested[]>([])
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedRequest, setSelectedRequest] = useState<BookRequested | null>(null)
    const [selectedBook, setSelectedBook] = useState<number | null>(null)
    const [pageNum, setPageNum] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [searchBooks, setSearchBooks] = useState<Book[]>([])
    const tableColumn: TableProps['columns'] = [
        {
            key: 'id',
            dataIndex: 'id',
            title: "ID"
        },
        {
            key: 'title',
            dataIndex: 'title',
            title: "Tiêu đề"
        },
        {
            key: 'description',
            dataIndex: 'description',
            title: "Mô tả"
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: "Trạng thái",
            render: (val, record, index) => renderStatus(val)
        },
        {
            key: "action",
            title: "Thao tác",
            render: (_, record, __) => <div className="d-flex flex-row gap-3 justify-content-center">

                {
                    record.status === 0 ? <Tooltip title="Từ chối">
                        <Tooltip title="Xác nhận">
                            <Button
                                shape="circle"
                                type="default"
                                onClick={() => {
                                    setSelectedRequest(record as BookRequested)
                                    setOpenModal(true)
                                }}
                                icon={<CheckOutlined />}
                            />
                        </Tooltip>
                        <Button
                            shape="circle"
                            type="default"
                            onClick={() => rejectRequest(record as BookRequested)}
                            icon={<CloseOutlined />}
                        />
                    </Tooltip> : null
                }
            </div>
        }
    ]

    useEffect(() => {
        getRequestedBookListData()
    }, [pageNum])

    const renderStatus = (status: number) => {
        switch (status) {
            case -1:
                return "Từ chối"
            case 0:
                return "Đang chờ"
            default:
                return "Hoàn thành"
        }
    }

    const confirmRequest = async (bookRequested: BookRequested, selectedBook: number) => {
        try {
            setLoading(true)
            const res = await handleAPI(`admin/confirmBookrequest/${bookRequested.id}?bookId=${selectedBook}`)
            if (res.status === 200) {
                setOpenModal(false)
                setSelectedBook(null)
                setSelectedRequest(null)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const rejectRequest = async (bookRequested: BookRequested) => {
        try {
            setLoading(true)
            await handleAPI(`books/cancelBookRequest/${bookRequested.id}`)
        } catch (error: any) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getRequestedBookListData = async () => {
        try {
            setLoading(true)
            const res: AxiosResponse<ResponseDTO<BookRequested[]>> = await handleAPI(`/admin/requestedBooks?pageNum=${pageNum}`);
            setRequestedBookList(res.data.data)
            setTotal(res.data.total ?? 0)
        } catch (error: any) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchBook = async (title: string) => {
        if (!title.trim()) {
            return;
        }
        try {
            const res: AxiosResponse<ResponseDTO<Book[]>> = await handleAPI(
                `books/search?title=${title}`
            );
            setSearchBooks(res.data.data)
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <>
            <Table loading={isLoading} columns={tableColumn} dataSource={requestedBookList} pagination={{
                total: total,
                onChange(page, pageSize) {
                    setPageNum(page)
                },
            }} />
            <Modal
                open={openModal}
                closable={false}
                title={"Xác nhận yêu cầu"}
                onOk={() => {
                    if (selectedRequest !== null && selectedBook !== null) {
                        confirmRequest(selectedRequest, selectedBook)
                    } else {
                        message.error('Có lỗi xảy ra! Vui lòng thử lại')
                    }
                }}
                onCancel={() => {
                    setSelectedRequest(null)
                    setSelectedBook(null)
                    setOpenModal(false)
                }} >
                <Select
                    className='w-100'
                    showSearch
                    placeholder={"Tên sách"}
                    defaultActiveFirstOption={false}
                    notFoundContent={"Không tìm thấy"}
                    optionFilterProp="label"
                    onSearch={debounceSearch(handleSearchBook, 1000)}
                    onChange={setSelectedBook}
                    options={(searchBooks || []).map((book) => ({
                        value: book.BookID,
                        label: book.Title,
                    }))}
                />
            </Modal>
        </>
    )
}

export default BookRequestedPage