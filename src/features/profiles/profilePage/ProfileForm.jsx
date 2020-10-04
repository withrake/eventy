import React from 'react';
import {Formik, Form } from 'formik';
import MyTextIput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../../../app/firestore/firestoreService';

export default function ProfileForm({profile}) {
    return (
        <Formik
            initialValues={{
                displayName: profile.displayName,
                description: profile.description || ''
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required()
            })}
            onSubmit={async (values, {setSubmitting}) => {
                try {
                    await updateUserProfile(values);
                } catch (error) {
                    toast.error(error.message);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({isSbumitting, isValid, dirty}) => (
            <Form className='ui form'>
                <MyTextIput name='displayName' placeholder='Display Name'/>
                <MyTextArea name='description' placeholder='Description'/>
                <Button 
                    loading={isSbumitting} //loading IF isSubmitting
                    disabled={isSbumitting || !isValid || !dirty}
                    floated='right'
                    type='submit'
                    size='large'
                    positive
                    content='Update profile'
                />
            </Form>
            )}
        </Formik>
    )
}