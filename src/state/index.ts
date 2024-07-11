import { StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { DomainAnswers } from '../domain/types'

type AnswersStoreProperties = DomainAnswers

type AnswersStoreActions = {
    setAnswers: (answers: DomainAnswers) => void
    getAnswers: () => DomainAnswers
}

export type AnswersStore = AnswersStoreProperties & AnswersStoreActions

const initialState: AnswersStoreProperties = {
    name: '',
    mail: '',
    age: '',
    interests: [],
}

const createStore: StateCreator<AnswersStore> = (set, get) => ({
    ...initialState,
    setAnswers: answers => set(state => ({ ...state, ...answers })),
    getAnswers: () => ({
        name: get().name,
        mail: get().mail,
        age: get().age,
        interests: get().interests,
    }),
})

export const useAnswersStore = create(devtools(createStore))
