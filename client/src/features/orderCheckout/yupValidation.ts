import * as yup from 'yup'

export const validationSchema = yup.object({
    name: yup.string().required('Wypełnij wszystkie pola'),
    lastName: yup.string().required('Wypełnij wszystkie pola'),
    city: yup.string().required('Wypełnij wszystkie pola'),
    zipCode: yup.string().required('Wypełnij wszystkie pola'),
    adress: yup.string().required('Wypełnij wszystkie pola'),
})