
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getcohortsPrint } from 'utils/cohorts/cohorts';

interface Game {
    gameTitle: any;
    companyName: any;
    creatorName: any;
    cohortsName:any;
}

interface GameData {
    message: string;
    cohortsDetails: Game[];
}

const Cohortsdatas: React.FC = () => {
    const { id } = useParams(); // Extract id from URL params
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [cohortsName, setCohortsName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const result = await getcohortsPrint(Number(id));
                    setGameData(result);
                    setCohortsName( result.cohortsName);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching game data:', err);
                setError('Failed to fetch game data');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ margin: '30px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                <thead>
                   <tr>
                    <th colSpan={4} align='left' >
                        Cohorts Name: {cohortsName}
                    </th>
                    </tr>
                    <tr>

                        <th style={{ border: '1px solid black', padding: '8px' }}>S.No</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Game Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Creator Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Company Name</th>
                    </tr>
                </thead>
                <tbody>
                    {gameData && gameData.cohortsDetails.map((cohort, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '8px' ,textAlign:'center'}}>{index + 1}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cohort.gameTitle}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cohort.creatorName}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cohort.companyName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Cohortsdatas;


