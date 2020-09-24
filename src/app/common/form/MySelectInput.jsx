import React from 'react';
import { FormField, Label, Select } from 'semantic-ui-react';
import { useField } from 'formik';

export default function MySelectInput({label, ...props}) {
    const [field, meta, helpers] = useField(props);
    return (
        <FormField error={meta.touched && !!meta.error}> 
            <label>{label}</label>
            <Select 
                clearablevalue={field.value || null}
                onChange={(e, d) => helpers.setValue(d.value)} //event and data have been specified as e and d. d.value is to specify the field with the value the user has selected
                onBlur={() => helpers.setTouched(true)}
                {...props} //the props that we pass along with our select input, like options and choices the user can make
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </FormField>
    )
} // the error is an object or a string and casted to a boolean. if there is a string/object it will hightlight the border as red
// this is a reusable text block