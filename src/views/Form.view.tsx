import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useUpdateAnswers } from '../api-hooks/useUpdateAnswers'
import { CheckboxGroup } from '../components'
import { useAnswersStore } from '../state'

import { validationSchema } from './Form.config'

export const FormView = () => {
    const answers = useAnswersStore(state => state.getAnswers())
    const navigate = useNavigate()

    const [redirect, setRedirect] = useState<string>()
    const [optionsCheck, setOptionsCheck] = useState<
        {
            id: string
            label: string
            checked: boolean
        }[]
    >([])

    useEffect(() => {
        // Transform answers.interests into the format expected by CheckboxGroup
        const transformedOptions = answers.interests.map(interest => {
            const [id, value] = Object.entries(interest)[0]
            return { id, label: value.label, checked: value.isChecked }
        })
        setOptionsCheck(transformedOptions)
    }, [answers.interests])

    const transformInterests = (
        interests: { id: string; label: string; checked: boolean }[],
    ) =>
        interests.map(interest => ({
            [interest.id]: {
                isChecked: interest.checked,
                label: interest.label,
            },
        }))

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
    })

    const updateAnswersMutation = useUpdateAnswers()

    const onSubmit = handleSubmit(formData => {
        const formattedInterests = transformInterests(
            formData.interests as {
                id: string
                label: string
                checked: boolean
            }[],
        )
        updateAnswersMutation.mutate({
            name: formData.name,
            mail: formData.mail,
            age: formData.age,
            interests: formattedInterests,
        })
        setRedirect('Redirecting...')
        setTimeout(() => {
            navigate('/table')
        }, 1500)
    })

    const handleToggleCheckbox = (checkOptions: any) => {
        setOptionsCheck(checkOptions)
    }

    return (
        <div id="form-view">
            <Box
                display="flex"
                gap={4}
                sx={{ flexDirection: 'column', width: '300px' }}
            >
                <Controller
                    name="name"
                    control={control}
                    defaultValue={answers.name}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Name"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.name?.message || ''}
                            error={Boolean(errors.name?.message)}
                        />
                    )}
                />
                <Controller
                    name="age"
                    control={control}
                    defaultValue={answers.age}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Age"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.age?.message || ''}
                            error={Boolean(errors.age?.message)}
                        />
                    )}
                />
                <Controller
                    name="mail"
                    control={control}
                    defaultValue={answers.mail}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Email"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.mail?.message || ''}
                            error={Boolean(errors.mail?.message)}
                        />
                    )}
                />
                {/*
                    TASK 2:
                    - Integrate CheckboxGroup into the form, controlled
                    by react-hook-form.
                    - Do NOT modify types of answers.interests or
                    CheckboxGroup's options. This could be detrimental
                    to your final assessment.
                */}
                <Controller
                    name="interests"
                    control={control}
                    defaultValue={optionsCheck}
                    render={({ field: { onChange } }) => (
                        <CheckboxGroup
                            id="interests"
                            label="Interests"
                            options={optionsCheck}
                            onChange={checkedOptions => {
                                handleToggleCheckbox(checkedOptions)
                                // Ensure react-hook-form captures the change
                                onChange(checkedOptions)
                            }}
                            helperText={errors.interests?.message || ''}
                            error={Boolean(errors.interests?.message)}
                        />
                    )}
                />
                <Button
                    variant="contained"
                    disabled={!isValid}
                    onClick={onSubmit}
                >
                    {redirect ? redirect : 'Submit'}
                </Button>
            </Box>
        </div>
    )
}
