"use client"
import { useEffect, useState } from "react";
import { getRated, getDetails } from "@/lib/api";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/Modal";
import Image from 'next/image';


export function RatedCard() {
  const [error, setError] = useState("");
  const [populars, setPopular] = useState<
    { id: number; title: string; poster_path: string; release_date: string; overview: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<{
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    overview: string;
    genres: { id: number; name: string }[];
    runtime: number;
    vote_average: number;
    adult: boolean;
  } | null>(null);

  useEffect(() => {
    getRated()
      .then((data) => {
        if (data && Array.isArray(data.results)) {
          setPopular(data.results);
        } else {
          setError("A API não retornou uma lista válida.");
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar populares:", err);
        setError("Erro ao carregar séries.");
      });
  }, []);

  const openModal = async (movieId: number) => {
    try {
      const movieDetails = await getDetails(movieId);
      setSelectedMovie(movieDetails);
      setIsModalOpen(true);
    } catch{
      setError("Erro ao carregar detalhes do filme.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="w-full h-full flex justify-center relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {populars.map((popular) => (
          <div
            key={popular.id}
            className="group cursor-pointer"
            onClick={() => openModal(popular.id)}
          >
            <div className="relative w-full h-[380px]">
              <div className="relative w-full h-full shadow-md rounded-xl border-none bg-transparent">
                <Card className="w-full h-full bg-transparent border-none">
                  <CardContent className="flex flex-col items-center p-2 sm:p-4">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${popular.poster_path}`}
                      alt={popular.title}
                      width={500}
                      height={750}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                    <CardTitle className="text-sm sm:text-lg font-bold text-center mt-4 text-white break-words">
                      {popular.title}
                    </CardTitle>

                  </CardContent>
                </Card>
              </div>

              <div className="absolute inset-0 w-full h-full rounded-xl bg-neutral-950 flex items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Card className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center text-center p-1">
                  <CardContent>
                    <h3 className="text-lg font-bold text-white">
                      Lançamento: {popular.release_date.split("-")[0]}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1 line-clamp-6">
                      {popular.overview}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedMovie && (
        <Modal selectedMovie={selectedMovie} closeModal={closeModal} />
      )}
    </div>
  );
}
