import { useRef, useState } from 'react';
import './App.css'
import { Footer, Header } from './Structure';
import QuestionBlock from './assets/components/QuestionBlock';
import Questions from './assets/js/Questions';
import { X } from 'lucide-react';

export default function App() {

	const [ run, setRun ] = useState( false );
	const quizLength = Questions.length;
	const [ no, setNo ] = useState( 0 );

	const getQuestionSeq = () => {

		const arr = [];
		while( arr.length < quizLength ) {

			const num = Math.round( Math.random() * ( quizLength - 1 ) );
			if ( !arr.find( elt => elt[ 0 ] === num ) )
				arr.push( [ num, ( () => {

					const arr = [];
					while( arr.length < 4 ) {

						const num = Math.round( Math.random() * 3 );
						if ( !arr.includes( num ) )
							arr.push( num );

					}
					return arr;

				} )() ] );

		}
		return arr;

	};
	const [ questionSeq, setQuestionSeq ] = useState( getQuestionSeq() );
	const currentQuestion = Questions[ questionSeq[ no ][ 0 ] ];
	const [ currentAnswer, setCurrentAnswer ] = useState( '' );
	const [ answers, setAnswers ] = useState( [] );
	const [ result, setResult ] = useState( [] );
	const dialogRef = useRef( null );

  	return <>

		<Header />
	
		<main className="min-h-[87vh] px-10">

			<section className="p-5 flex flex-col items-center justify-center gap-5">

				<h1 className="text-3xl md:text-5xl font-bold text-center">Welcome to the Quiz App</h1>
				<p className="text-lg md:text-xl text-center">This is a simple quiz application built using React and Tailwind CSS.</p>

			</section>

			<section className={ `mx-auto mt-5 md:p-5 md:w-250 min-h-100 bg-blue-100 border-2 border-blue-300 rounded-2xl flex ${ !run ? 'items-center justify-center' : 'flex-col' }` }>

				{ !run ?
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
						onClick={ () => setRun ( true ) }
					>Start Quiz</button> :

					<>

						<QuestionBlock current={ no } sequence={ questionSeq } currentAnswer={ currentAnswer } setCurrentAnswer={ setCurrentAnswer } />

						<section className="mt-5 flex flex-row">

							<section className="grow content-center text-lg">
								{ !!currentAnswer && <><span className="italic">Your Selected Answer</span>: { currentAnswer }</> }
							</section>

								<button type="button"
									className="w-1/6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
									onClick={ () => {

										const { id } = currentQuestion;
										if ( answers.find( elt => elt.id === id ) )
											return;

										const answer = [ ...answers, { id: id, answer: currentAnswer } ];
										setAnswers( answer );

										setCurrentAnswer( '' );
										setNo( n => n < 9 ? n + 1 : n );

										if ( no < ( quizLength - 1 ) )
											return;

										const rlt = answer.map( elt => Questions.find( elet => elt.id === elet.id )?.answer === elt.answer );
										setResult( rlt );

										dialogRef.current?.showModal();

									} }
								>{ no < ( quizLength - 1 ) ? 'Next' : 'Submit' }</button>

						</section>

					</>

				}

			</section>

			{ result && <dialog id="show-result-dialog" ref={ dialogRef } className="m-auto p-5 border border-gray-300 rounded-3xl w-2/3">

                <div className="flex flex-row justify-between" >

                    <div className="text-3xl font-semibold content-center">Result</div>
                    <button
						className="text-lg bg-red-400 text-white rounded-lg p-2 hover:bg-red-500 cursor-pointer"
						onClick={ () => {

							dialogRef.current?.close();
							setRun( false );
							setNo( 0 );
							setQuestionSeq( getQuestionSeq() );
							setCurrentAnswer( '' );
							setAnswers( [] );
							setResult( [] );

						} }
					><X /></button>

                </div>

				<div className="mt-5 max-h-100 flex flex-col gap-5 overflow-y-scroll">

					{ result.every( f => f ) ?
						<section className="font-semibold text-lg">Good Job! 10 Correct Answers of 10 Questions</section> :
						<section className="font-semibold text-lg">{ result.filter( f => f ).length } Correct Answers of 10 Questions. Better Luck Next Time.</section>
					}

					{ result.map( ( elt, idx ) => {

						const question = Questions[ questionSeq[ idx ][ 0 ] ];

						return <section key={ idx }>

							<section className="text-lg md:text-2xl font-semibold">Question { idx + 1 }:</section>
							<section className="grow text-lg md:text-xl">{ question.question }</section>

							<section className="mt-5 flex flex-col gap-3">

								<label className={ `${ elt ? 'bg-green-200' : 'bg-red-200' } text-lg py-2 px-4 rounded-lg` }>
									<span className="font-semibold">Your Answer:</span> { answers.find( elt => elt.id === question.id ).answer }
								</label>

								{ !elt && <label className={ `bg-green-200 text-lg py-2 px-4 rounded-lg` }>
									<span className="font-semibold">Correct Answer:</span> { question.answer }
								</label> }

							</section>

						</section>;

					} ) }

				</div>

            </dialog> }

		</main>

		<Footer />

	</>;

}