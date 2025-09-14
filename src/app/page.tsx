"use client"

import Graph from "./components/Graph";
import { useState } from "react";
import { ArtistList } from "./api/Artists";
import { SubgenreList } from "./api/Genres";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [toggleFocus, setToggleFocus] = useState(false);
  const [activeFocus, setActiveFocus] = useState("Popularity");

  const focusOptions = ["Popularity", "Followers", "Listens"]

  const sortedSubgenreBubbles = [...SubgenreList].sort((a, b) => b.count - a.count)

  return (
    <div className="flex items-center w-full">
      <aside className={`fixed left-0 top-0 h-full z-10 transition-transform duration-300 ${menuOpen ? "translate-x-0 w-64 p-4" : "-translate-x-full w-64 p-4"} bg-gray-100/20 shadow-md backdrop-blur-sm`}>

        <div className="relative w-full flex items-center h-12">
          <button onClick={() => setMenuOpen(false)} className=" flex items-center justify-center w-10 rounded-lg bg-gray-100/20 text-black py-2 hover:bg-lime-400/20 transition">
            ⮜
          </button>

          <h2 className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg">Menu</h2>
        </div>

        <div className="space-y-2">

          <div>
            <h2 className="font-bold text-lg text-center">Add Artist</h2>
            <div className="flex flex-col items-center space-y-3 p-4">
              <input type="text" placeholder="Enter text..." className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />

              <button className="w-full px-3 py-2 rounded-lg bg-lime-400 text-white font-semibold hover:bg-green-600 transition">
                Add
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg text-center">Artists</h2>
            <div className="max-h-80 flex flex-col items-center text-center overflow-y-auto p-4 space-y-6">
              {ArtistList.map((artist) => (
                <div key={artist.id} className="relative flex flex-col items-center text-center space-y-2 w-24">

                  <img src={artist.image} alt={artist.name}
                    className="w-24 h-24 object-cover rounded-full shadow-md" />
                  <p className="text-sm font-medium">{artist.name}</p>

                  <button className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow-md hover:bg-red-600" aria-label={`Remove ${artist.name}`}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full px-3 py-2 rounded-lg bg-lime-400 text-white font-semibold hover:bg-green-600 transition">
            Sign Out
          </button>

          <button className="w-full px-3 py-2 rounded-lg bg-lime-400 text-white font-semibold hover:bg-green-600 transition">
            Settings
          </button>

        </div>
      </aside>

      {!menuOpen && (
        <button onClick={() => setMenuOpen(true)} className="fixed left-0 top-4 z-20 bg-gray-100/20 shadow-md backdrop-blur-sm text-black px-3 py-2 rounded-r-lg hover:bg-lime-400/20 " >
          ⮞
        </button>
      )}

      <Graph />

      <div className="absolute top-4 right-4 flex flex-col space-y-4 items-end max-h-80 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {sortedSubgenreBubbles.map((subgenre) => (
          <div key={subgenre.id} className="w-40 min-h-10 rounded-full text-white flex items-center justify-center shadow-lg"
            style={{ backgroundColor: subgenre.color !== "" ? subgenre.color : "#ededed" }}>
            {subgenre.name} {subgenre.count}
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-25 w-14 h-14 flex items-center">
        <div className="relative">
          <button onClick={() => setToggleFocus(!toggleFocus)}
            className="w-22 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-sm 
            font-semibold text-black shadow-lg hover:bg-lime-400/20 transition">
            {activeFocus}
          </button>

          {toggleFocus && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col space-y-2">
              {focusOptions.filter(focus => focus !== activeFocus).map((focus) => (
                <button
                  key={focus}
                  onClick={() => {
                    setActiveFocus(focus);
                    setToggleFocus(false);
                  }}
                  className="w-22 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-sm 
            font-semibold text-black shadow-lg hover:bg-lime-400/20 transition">
                  {focus}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="fixed bottom-6 left-1/2 transform w-14 h-14 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm 
        flex items-center justify-center text-sm font-semibold text-black shadow-lg hover:bg-lime-400/20 transition">
        Center
      </button>

      <button className="fixed bottom-6 left-1/2 transform translate-x-18 w-14 h-14 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm 
        flex items-center justify-center text-sm font-semibold text-black shadow-lg hover:bg-lime-400/20 transition">
        ?
      </button>
    </div>
  );
}
