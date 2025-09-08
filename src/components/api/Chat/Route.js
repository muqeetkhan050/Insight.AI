'use server'

import {nextRequest, nextResponse} from 'next/server';
import {GoogleGenerativeAI} from '@langchain/google-genai';
import {GoogleGenerativeAIEmbeddings} from '@langchain/google-genai';
import {TaskType} from '@langchain/google-genai';
import {QdrenaVectorStore} from '@@langchain/qdrant';

export async function POST(request:nextRequest){
    return(

    )
}

