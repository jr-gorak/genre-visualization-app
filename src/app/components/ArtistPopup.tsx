
export function ArtistPopup({ popupOpen, onClose, activeArtist }: { popupOpen: boolean; onClose: any; activeArtist: any; }) {

    if (!popupOpen) return;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
                    ✕
                </button>
                <h2 className="text-xl font-bold text-center mb-4">{activeArtist.name}</h2>
                <img className="mx-auto rounded-lg shadow items-center justify-center" src={activeArtist.image} alt={activeArtist.name}></img>

                <div className="pt-5 pb-1 mt-4">
                    <p>Potential bio can go here</p>
                </div>
                <div className="pt-1 pb-1">
                    Popularity: {activeArtist.popularity}/100
                </div>
                <div className="pt-1 pb-1">
                    Followers: {activeArtist.followers}
                </div>

                <div className="flex flex-wrap gap-2 justify-start items-center">
                    Subgenres:
                    {activeArtist.subgenres.map((subgenre: any) => (
                        <div className="w-auto h-10 p-2 rounded-full text-black flex items-center justify-center shadow-lg">
                            {subgenre.name}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )

}