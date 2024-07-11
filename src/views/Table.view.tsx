import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useResetAnswers } from '../api-hooks/useResetAnswers'
import type { DomainAnswers, DomainOption } from '../domain/types'
import { useAnswersStore } from '../state'

// TASK 4:
// - Implement the table from this mockup (public/table_view_mockup.png).
// - Display answers from store in table.
// - Each row of the table body should have the name of the answer
// and its value.
// - Add the edit and delete buttons on top of the table.

// TASK 5:
// - Redirect to Form view on edit button click.

// TASK 7:
// - Invoke useResetAnswers hook on delete button click.
// - See useResetAnswers hook for more guidelines.

export const TableView = () => {
    // This loading should actually be done in a context/global state
    // for fetching/editing/deleting to work correctly between form and table
    // The backend has a hardcoded timeout to simulate, while that's running,
    // it should "loading === true"
    const [loading, setLoading] = useState<boolean>(true)
    const answersStore = useAnswersStore()
    const [tableHeaders, setTableHeaders] = useState<string[]>([])
    const [rows, setRows] = useState<DomainAnswers[]>([])

    const selectAnswers = useMemo(
        () => answersStore.getAnswers(),
        [answersStore],
    )

    useEffect(() => {
        setLoading(true)
        const newAnswers = useAnswersStore
            .getState()
            .getAnswers() as unknown as DomainAnswers
        if (JSON.stringify(rows[0]) !== JSON.stringify(newAnswers)) {
            setRows([newAnswers])
            setTableHeaders(Object.keys(newAnswers))
        }
        setLoading(false)
    }, [selectAnswers])

    type InterestsArray = DomainOption[]

    function getCheckedLabels(interests: InterestsArray): string[] {
        const checkedLabels = interests
            .filter(item => {
                const key = Object.keys(item)[0]
                return item[+key].isChecked === true
            })
            .map(item => {
                const key = Object.keys(item)[0]
                return item[+key].label
            })

        return checkedLabels
    }

    const resetAnswersMutation = useResetAnswers()

    const handleDelete = () => {
        setLoading(true)
        resetAnswersMutation.mutate(undefined, {
            onSuccess: () => {
                console.log('Answers reset successfully.')
                setLoading(false)
            },
            onError: error => {
                console.error('Error resetting answers:', error)
                setLoading(false)
            },
        })
    }

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column' }}
            id="table-view"
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to={'/form'}>
                    <EditIcon sx={{ color: 'grey', padding: '0.5rem' }} />
                </Link>
                <DeleteIcon
                    sx={{
                        color: 'grey',
                        cursor: 'pointer',
                        padding: '0.5rem',
                    }}
                    onClick={handleDelete}
                />
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((header, idx) => (
                                <TableCell key={idx} sx={{ fontWeight: 700 }}>
                                    {header.charAt(0).toUpperCase() +
                                        header.slice(1)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={tableHeaders.length}
                                    align="center"
                                >
                                    <img
                                        src="/loader.gif"
                                        height={32}
                                        alt="Loading..."
                                    />
                                </TableCell>
                            </TableRow> // LOADER HERE
                        ) : rows[0]?.name === '' || !rows.length ? (
                            <TableRow>
                                <TableCell
                                    colSpan={tableHeaders.length}
                                    align="center"
                                >
                                    {'No info submitted'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {row.mail}
                                    </TableCell>
                                    <TableCell align="left">
                                        {row.age || 'AGE'}
                                    </TableCell>
                                    <TableCell align="left">
                                        {getCheckedLabels(row.interests).join(
                                            ', ',
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
