import { Fragment } from "react";
import Questions from "../js/Questions";

export default function QuestionBlock( { current, sequence, currentAnswer, setCurrentAnswer } ) {

    const question = Questions[ sequence?.[ current ]?.[ 0 ] ];

    return <>

        <section className="text-lg md:text-2xl font-semibold">Question { current + 1 }:</section>
        <section className="grow text-lg md:text-xl font-normal">{ question?.question }</section>
        <section className="mt-5 flex flex-col gap-3">

            { sequence?.[ current ]?.[ 1 ].map( ( elt, idx ) => {

                const option = question.options[ elt ];

                return <Fragment key={ `option-${ idx }` }>

                    <input
                        type="radio"
                        name="anwser"
                        id={ `option${ idx + 1 }` }
                        className="hidden"
                        onChange={ () => setCurrentAnswer( option ) }
                        { ...{ checked: false } }
                    />

                    <label
                        htmlFor={ `option${ idx + 1 }` }
                        className={ `${ currentAnswer === option ? 'bg-blue-400' : 'bg-blue-200 hover:bg-blue-300' } text-lg md:text-xl font-normal py-2 px-4 rounded-lg cursor-pointer flex flex-row gap-2 items-center` }
                    > { option } </label>

                </Fragment>;

            } ) }

        </section>

    </>;

}