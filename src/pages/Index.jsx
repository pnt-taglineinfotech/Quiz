import { useEffect, useRef, useState } from 'react';
import QuestionBlock from '../assets/components/QuestionBlock';
import Questions from '../assets/js/Questions';
import { X } from 'lucide-react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export default function Index() {

	const [ run, setRun ] = useState( false );

	const quizLength = Questions.length;
	const [ current, setCurrent ] = useState( 0 );

	const getSequence = () => {

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

	const [ sequence, setSequence ] = useState( [] );
	const [ answers, setAnswers ] = useState( [] );

	useEffect( () => {

		if ( localStorage.getItem( 'Quiz' ) )
			setRun( true );

	} , [] );

	useEffect( () => {

		if ( run ) {

			const local = JSON.parse( localStorage.getItem( 'Quiz' ) || '{}' );

			if ( local.sequence )
				setSequence( local.sequence );
			else {

				local.sequence = getSequence();
				setSequence( local.sequence );
				localStorage.setItem( 'Quiz', JSON.stringify( local ) );

			}

			if ( local.current )
				setCurrent( local.current );
			else {

				local.current = 0;
				setCurrent( local.current );
				localStorage.setItem( 'Quiz', JSON.stringify( local ) );

			}

			if ( local.answers )
				setAnswers( local.answers );
			else {

				local.answers = [];
				setAnswers( local.answers );
				localStorage.setItem( 'Quiz', JSON.stringify( local ) );

			}

		} else {

			setSequence( [] );
			setCurrent( 0 );
			setAnswers( [] );
			setSequence( [] );
			setCurrentAnswer( '' );
			setResult( [] );

		}
		
	}, [ run ] );

	const currentQuestion = Questions[ sequence?.[ current ]?.[ 0 ] ];
	const [ currentAnswer, setCurrentAnswer ] = useState( '' );
	const [ result, setResult ] = useState( [] );
	const dialogRef = useRef( null );

	const [ cookies, setCookie, removeCookie ] = useCookies( [ import.meta.env.VITE_COOKIE_NAME ] );
	const goto = useNavigate();
	const [ confirm, setConfirm ] = useState( false );
	const confirmRef = useRef( null );

	return <main className="min-h-[87vh] px-10">
	
		<section className="p-5 flex flex-col items-center justify-center gap-5">

			<h1 className="text-3xl md:text-5xl font-bold text-center">Welcome to the Quiz App</h1>
			<p className="text-lg md:text-xl text-center">This is a simple quiz application built using React and Tailwind CSS.</p>

		</section>

		<section className="flex gap-2 items-center">

			<p className="grow text-lg">
				<span className="font-semibold">Last Score:</span> { String( cookies?.[ import.meta.env.VITE_COOKIE_NAME ]?.[ 0 ]?.at( -1 )?.score || '--' ).padStart( 2, '0' ) }
			</p>
			{ run && <button
				className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg cursor-pointer"
				onClick={ () => {

					setConfirm( true );
					setTimeout( () => confirmRef.current?.showModal(), 10 );

				} }
			>End Quiz</button> }
			<button
				className="bg-slate-500 hover:bg-slate-700 text-white py-2 px-4 rounded-lg cursor-pointer"
				onClick={ () => goto( '/history' ) }
			>History</button>

		</section>

		<section className={ `mx-auto mt-5 p-5 md:w-250 min-h-100 bg-blue-100 border-2 border-blue-300 rounded-2xl flex ${ !run ? 'items-center justify-center' : 'flex-col' } select-none` }>

			{ !run ?
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
					onClick={ () => setRun ( true ) }
				>Start Quiz</button> :
				<>

					<QuestionBlock { ...{ current, sequence, currentAnswer, setCurrentAnswer } } />

					<section className="mt-5 flex flex-col md:flex-row gap-5">

						<p className="grow content-center text-lg">
							{ !!currentAnswer && <><span className="italic">Your Selected Answer</span>: { currentAnswer }</> }
						</p>

						<button type="button"
							className="w-fit md:w-1/6 self-center md:self-end bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer disabled:bg-green-400 disabled:hover:bg-green-400 disabled:cursor-not-allowed"
							onClick={ () => {

								const { id } = currentQuestion;
								if ( answers.find( elt => elt.id === id ) )
									return;

								const answer = [ ...answers, { id: id, answer: currentAnswer } ]
								setAnswers( answer );

								setCurrentAnswer( '' );
								const cur = current < ( quizLength - 1 ) ? current + 1 : current;
								setCurrent( cur );

								localStorage.setItem( 'Quiz', JSON.stringify( {
									...JSON.parse( localStorage.getItem( 'Quiz' ) ),
									answers: answer,
									current: cur
								} ) )

								if ( answer.length < quizLength )
									return;

								const relt = answer.map( elt => Questions.find( elet => elt.id === elet.id )?.answer === elt.answer );
								setResult( relt );

								const [ history, seq ] = cookies?.[ import.meta.env.VITE_COOKIE_NAME ] || [ [], 0 ];
								setCookie(
									import.meta.env.VITE_COOKIE_NAME,
									[ [ ...history, {
										id: ( seq + 1 ),
										timestamp: Temporal.Now.instant().toString(),
										score: relt.filter( f => f ).length
									} ], ( seq + 1 ) ],
									{
										path: '/',
										maxAge: Temporal.Duration.from( { days: 7 } ).total( { unit: 'seconds' } ),
										secure: true,
										sameSite: 'strict'
									}
								);

								setTimeout( () => dialogRef.current?.showModal(), 10 );

							} }
							{ ...!currentAnswer && { disabled: true } }
						>{ current < ( quizLength - 1 ) ? 'Next' : 'Submit' }</button>

					</section>

				</>

			}

		</section>

		{ ( run && result.length === quizLength ) && <dialog id="show-result-dialog" ref={ dialogRef } className="m-auto p-5 border border-gray-300 rounded-3xl md:w-2/3">

			<section className="flex justify-between" >

				<h3 className="text-3xl font-semibold content-center">Result</h3>
				<button
					className="text-lg bg-red-400 text-white rounded-lg p-2 hover:bg-red-500 cursor-pointer"
					onClick={ () => {

						dialogRef.current?.close();
						setRun( false );
						localStorage.removeItem( 'Quiz' );

					} }
				><X /></button>

			</section>

			<section className="mt-5 max-h-100 flex flex-col gap-5 overflow-y-scroll">

				<h4 className="font-semibold text-lg">
					{ result.filter( f => f ).length } Correct Answers of 10 Questions. { result.every( f => f ) ? "Good Job!" : "Better Luck Next Time." }
				</h4>

				{ result.map( ( elt, idx ) => {

					const question = Questions[ sequence[ idx ][ 0 ] ];

					return <section key={ `result-${ idx - 1 }` }>

						<section className="text-lg md:text-2xl font-semibold">Question { idx + 1 }:</section>
						<section className="grow text-lg md:text-xl">{ question.question }</section>

						<section className="mt-5 flex flex-col gap-3">

							<label className={ `${ elt ? 'bg-green-200' : 'bg-red-200' } text-lg py-2 px-4 rounded-lg` }>
								<span className="font-semibold">Your Answer:</span> { answers.find( elet => elet.id === question.id ).answer }
							</label>

							{ !elt && <label className="bg-green-200 text-lg py-2 px-4 rounded-lg">
								<span className="font-semibold">Correct Answer:</span> { question.answer }
							</label> }

						</section>

					</section>;

				} ) }

			</section>

		</dialog> }

		{ confirm && <dialog className="m-auto p-5 border border-gray-300 rounded-3xl md:w-2/5 bg-orange-50" ref={ confirmRef } >
		
			<section className="text-3xl font-semibold text-center text-orange-600">Warning!!!</section>
            <section className="p-5">
				Do you want to end this quiz?<br />
				Your scores will <strong>not</strong> be saved.
			</section>
            <section className="w-full flex justify-around">

                <button
                    className="text-lg bg-gray-400 hover:bg-gray-500 text-white rounded-2xl px-4 py-2 cursor-pointer"
                    onClick={ () => setConfirm( false ) }
                >Cancel</button>

                <button
                    className="text-lg bg-orange-400 hover:bg-orange-500 text-white rounded-2xl px-4 py-2 cursor-pointer"
                    onClick={ () => {

						setRun( false );
						localStorage.removeItem( 'Quiz' );
                        setConfirm( false );

                    } }
                >Yes</button>

            </section>
		
		</dialog> }

	</main>;

}