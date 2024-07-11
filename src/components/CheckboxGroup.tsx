import {
    Box,
    Checkbox,
    FormControlLabel,
    InputLabel,
    CheckboxProps,
    FormHelperText,
    FormControl,
} from '@mui/material'
import React from 'react'

type CustomCheckboxProps = CheckboxProps & {
    id: string
    label?: string
}

type CheckboxGroupProps = Partial<{
    id: string
    label: string
    helperText: string
    error: boolean
    options: Array<CustomCheckboxProps>
    onChange: (options: Array<CustomCheckboxProps>) => void
}>

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    id,
    label,
    helperText,
    error,
    options = [],
    onChange = () => null,
}) => {
    const internalOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedOptions = options.map(option =>
            option.id === event.target.id
                ? { ...option, checked: event.target.checked }
                : option,
        )
        onChange(changedOptions)
    }

    const checkboxGroupId = id ?? ''

    return (
        <div id={checkboxGroupId} className="checkbox-group">
            <InputLabel id={checkboxGroupId} error={error}>
                {label}
            </InputLabel>
            <FormControl error={error}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {options.map(option => {
                        const checkboxId = option.id || ''
                        return (
                            <FormControlLabel
                                key={checkboxId}
                                label={option.label}
                                control={
                                    <Checkbox
                                        {...option}
                                        id={checkboxId}
                                        onChange={internalOnChange}
                                        color={error ? 'error' : 'primary'}
                                        checked={option.checked}
                                    />
                                }
                            />
                        )
                    })}
                </Box>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </div>
    )
}

export default CheckboxGroup
