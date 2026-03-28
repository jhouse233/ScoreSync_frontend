import ScoreLibraryHeader from "./ScoreLibraryHeader/ScoreLibraryHeader";
import './ScoreLibrary.css'

export default function ScoreLibrary(){
    return (
        <div className="scorelibrary">
            <ScoreLibraryHeader />
            <div className="scorelibrary__content"></div>
        </div>
    )
}