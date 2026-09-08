import { ArrowLeft } from "lucide-react";
import { Fragment } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function History() {

    const goto = useNavigate();
    const cookies = useCookies( [ import.meta.env.VITE_COOKIE_NAME ] )[ 0 ];
    const matchs = cookies[ import.meta.env.VITE_COOKIE_NAME ]?.[ 0 ] || [];

    return <main className="min-h-[87vh] p-5 md:px-10">

        <section className="md:py-5 flex gap-5 items-center">

            <button
                type="button"
                className="w-fit p-2 bg-slate-500 text-white border border-slate-400 rounded-lg hover:bg-slate-600 cursor-pointer"
                onClick={ () => goto( '/' ) }
            ><ArrowLeft /></button>
            <section className="grow text-lg md:text-3xl font-bold">History</section>

        </section>

        { ( matchs && matchs.length === 0 ) ?
            <section className="md:w-3/5 mx-auto p-5 bg-gray-100 border-2 border-gray-300 rounded-3xl text-center content-center font-bold text-gray-500"> No History </section> :
            <>

                <section className="md:w-3/5 mx-auto mt-5 bg-black font-semibold text-white rounded-3xl flex border">

                    <section className="w-1/2 p-5 text-center">Date Time</section>
                    <section className="w-1/2 p-5 text-center">Score</section>

                </section>

                <section className="md:w-3/5 max-h-[60vh] overflow-y-scroll scrollbar-none mx-auto mt-1 bg-gray-100 border-2 border-gray-300 rounded-3xl flex flex-col">

                    { matchs
                    .sort( ( a, b ) => Temporal.Instant.from( b.timestamp ).epochMilliseconds - Temporal.Instant.from( a.timestamp ).epochMilliseconds )
                    .map( ( data, idx ) => <Fragment key={ `data-${ idx + 1 }` }>

                        <section className="flex">

                            <section className="w-1/2 p-5 text-center content-center">
                                { Temporal.Instant.from( data.timestamp )
                                .toZonedDateTimeISO( 'UTC' )
                                .toLocaleString( 'en-GB', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                } )
                                .replace( ',', '' ) }
                            </section>
                            <section className="w-1/2 p-5 text-center content-center">{ String( data.score ).padStart( 2, '0' ) }</section>

                        </section>

                        { idx < ( matchs.length - 1 ) && <hr className="mx-10 border-[1.5px] border-gray-300"/> }

                    </Fragment> ) }

                </section>

            </>
        }

    </main>;

}