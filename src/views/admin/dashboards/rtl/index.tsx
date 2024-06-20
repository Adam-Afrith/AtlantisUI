/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
																																																																																	   
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, Icon, Select, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
// Assets
// Custom components
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import React, { useEffect, useState } from 'react';
import { MdCreate, MdGamepad, MdMoreTime, MdOutlineRocketLaunch } from 'react-icons/md';
import { noofCompany } from 'utils/dashboard/dashboardService';
import CheckTable from 'views/admin/dashboards/rtl/components/CheckTable';
import CreatorDailyTraffic from 'views/admin/dashboards/rtl/components/CreatorDailyTraffic';
import PieCard from 'views/admin/dashboards/rtl/components/PieCard';
import CreatorPieCard from 'views/admin/dashboards/rtl/components/CreatorPieCard';
import LearnerTotalSpent from 'views/admin/dashboards/rtl/components/LearnerTotalSpent';
import CreatorTotalSpent from 'views/admin/dashboards/rtl/components/CreatorTotalSpent';
import WeeklyRevenue from 'views/admin/dashboards/rtl/components/WeeklyRevenue';
import tableDataCheck from 'views/admin/dashboards/rtl/variables/tableDataCheck';
import LearnerDailyTraffic from './components/LearnerDailyTraffic';
import { GiClassicalKnowledge, GiProgression, GiSandsOfTime } from 'react-icons/gi';
import { FaBuildingColumns } from 'react-icons/fa6';

interface YourStateType {
	totalCompany: any;
	totalCreators: any;
	creatorsMonthwise: any;
	GameMonthwise: any;
	totalLearners: any;
	learnerMonthwise: any;
	totalGame: any;
	learnersAccessed: any;
	learnersProgress: any;
	learnersCompletion: any;
    timeSpentLearning:any;
	timeSpentCreating:any;
}

export default function UserReports() {
	const [result, setResult] = useState<YourStateType>({
		totalCompany: '',
		totalCreators: '',
		creatorsMonthwise: '',
		GameMonthwise: '',
		totalLearners: '',
		learnerMonthwise: '',
		totalGame: '',
		learnersAccessed: '',
	learnersProgress: '',
	learnersCompletion: '',
	timeSpentLearning:'',
	timeSpentCreating:'',

	});
	useEffect(() => {
		const fetchData = async () => {
			const res = await noofCompany();
			if (res?.status !== 'Success') return console.log('noOf useEffect Error :', res?.message);
			setResult((prev: YourStateType) => {
				return {
					...prev,
					totalCompany: res?.data?.companyCount,
					totalCreators: res?.data?.CreatorCount,
					creatorsMonthwise: res?.data?.newCreator,
					totalLearners: res?.data?.LearnerCount,
					learnerMonthwise: res?.data?.newLearner,
					totalGame: res?.data?.GamesCount,
					GameMonthwise: res?.data?.newGames,
					learnersAccessed : res?.data?.LearnersAccessed,
					learnersProgress : res?.data?.LearnersProgress,
					learnersCompletion : res?.data?.LearnersCompletion,
					timeSpentLearning:res?.data?.timeSpentLearning[0]?.learner_total,
					timeSpentCreating:res?.data?.timeSpentCreating[0]?.creator_total,
				}
			});
		}
		fetchData();
	}, []);
	// Chakra Color Mode
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	return (
		<Box pt={{ base: '100px', md: '80px', xl: '80px' }}>
			<SimpleGrid columns={{ base: 2, md: 2, lg: 3, '2xl': 4 }} gap='20px' mb='20px'>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={FaBuildingColumns} color={brandColor} />}
						/>
					}
					name='Companies' 
					value={result.totalCompany}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdCreate} color={brandColor} />}
						/>
					}
					name='Creators'
					value={result.totalCreators}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdCreate} color={brandColor} />}
						/>
					}
					name='Active Creators'
					value={result.creatorsMonthwise}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdGamepad} color={brandColor} />}
						/>
					}
					name='Games Created'
					value={result.totalGame}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							// bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
							bg={boxBg}
							icon={<Icon w='28px' h='28px' as={MdOutlineRocketLaunch} color={brandColor} />}
						/>
					}
					name='Games Launched'
					value={result.GameMonthwise}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={GiClassicalKnowledge} color={brandColor} />}
						/>
					}
					name='Learners'
					value={result.totalLearners}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={GiClassicalKnowledge} color={brandColor} />}
						/>
					}
					name='Active Learners'
					value={result.learnerMonthwise}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							// bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
							bg={boxBg}
							icon={<Icon w='28px' h='28px' as={MdMoreTime} color={brandColor} />}
						/>
					}
					name='Time Spent Creating'
					value={result.timeSpentCreating}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={GiSandsOfTime} color={brandColor} />}
						/>
					}
					name='Time Spent Learning'
					value={result.timeSpentLearning}
				/>
				{/**Afrith-modified-09-JAN-24**/}
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={GiClassicalKnowledge} color={brandColor} />}
						/>
					}
					name='Total Learners accessed'
					value={result.learnersAccessed}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={GiProgression} color={brandColor} />}
						/>
					}
					name='Progress of Learners'
					value={result.learnersProgress}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={GiClassicalKnowledge} color={brandColor} />}
						/>
					}
					name='Completion of Learners'
					value={result.learnersCompletion}
				/>
				{/*****************************/}
			</SimpleGrid>

			<SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
				<CreatorTotalSpent />
				<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
					<CreatorDailyTraffic />
					<CreatorPieCard />
				</SimpleGrid>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
				<WeeklyRevenue />
				<CheckTable tableData={tableDataCheck} />
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
				<LearnerTotalSpent />
				<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
					<LearnerDailyTraffic />
					<PieCard />
				</SimpleGrid>
			</SimpleGrid>
			{/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
				<ComplexTable tableData={tableDataComplex} />
				<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
					<Tasks />
					<MiniCalendar h='100%' minW='100%' selectRange={false} />
				</SimpleGrid>
			</SimpleGrid> */}
		</Box>
	);
}
