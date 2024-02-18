import * as yup from 'yup'

export const validationSchema = yup.object({
    name: yup.string().required('Wypełnij wszystkie pola'),
    category: yup.string().required('Wypełnij wszystkie pola'),
    type: yup.string().required('Wypełnij wszystkie pola'),
    price: yup.number().required('Nieprawidłowa wartość').moreThan(1000).label('Nieprawidłowa wartość'),
    quantityInStock: yup.number().required('Nieprawidłowa wartość').min(0).label('Nieprawidłowa wartość'),
    description: yup.string().required('Wypełnij wszystkie pola'),
    picture: yup.mixed().when("pictureUrl",{
        is: (url: string) => !url,
        then: schema => schema.required("Dodaj zdjęcie"),
        otherwise: schema => schema.notRequired()
    })
})