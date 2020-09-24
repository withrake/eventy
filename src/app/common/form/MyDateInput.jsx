import React from 'react';
import { FormField, Label } from 'semantic-ui-react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'

export default function MyDateInput({label, ...props}) {
    const {setFieldValue} = useFormikContext(); //instead of using helpers, we use this method for setting field values
    const [field, meta] = useField(props);
    return (
        <FormField error={meta.touched && !!meta.error}> 
            <label>{label}</label>
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null} //if we a value make it date format, else null
                onChange={value => setFieldValue(field.name, value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </FormField>
    )
} // the error is an object or a string and casted to a boolean. if there is a string/object it will hightlight the border as red
// this is a reusable text block