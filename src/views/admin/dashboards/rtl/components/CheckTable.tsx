/* eslint-disable */ 

import { Flex, Box, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { useEffect, useState } from 'react';

import { noofCompany } from 'utils/dashboard/dashboardService';


interface YourStateType {
	
	totalGame: any;
	GameMonthwise: any;
	// getGameList:{
	//   gameTitle:any,
	//   gameTotalScore:any,
	// }[],
	getGameList:any,

  }

type RowObj = {
	name: string;
	progress: string;
	score: number;
	date: string;
};
 
const columnHelper = createColumnHelper<RowObj>();

export default function CheckTable(props: { tableData: any }) {
	const { tableData } = props;
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	let defaultData = tableData;
  
	const [result, setResult] = useState<YourStateType>({
	  totalGame: 90,
	  GameMonthwise: 10,
	  getGameList: [],
	});
  
	useEffect(() => {
	  const fetchData = async () => {
		const res = await noofCompany();
		if (res?.status !== 'Success') return console.log('noOf useEffect Error :', res?.message);
		setResult((prev: YourStateType) => {
		  return {
			...prev,
			totalGame: res?.data?.GamesCount,
			GameMonthwise: res?.data?.newGames,
			getGameList: res?.data?.getGameList,
		  };
		});
	  };
	  fetchData();
	}, []);
  
	console.log('tableResult--', result);
  
	const columns = [
		columnHelper.accessor('name', {
		  // ... (previous configuration)
		  cell: (cell) => (
			<Flex align='center'>
			  <Text color={textColor} fontSize='sm' fontWeight='700'>
				{result.getGameList[cell.row.index]?.gameTitle}
			  </Text>
			</Flex>
		  ),
		}),
		columnHelper.accessor('progress', {
		  // ... (previous configuration)
		  cell: (cell) => {
			const totalScore = 1000;
			const gameTotalScore = result.getGameList[cell.row.index]?.gameTotalScore;
	
			if (totalScore && gameTotalScore !== null) {
			  const percentage = (gameTotalScore / totalScore) * 100;
			  return (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
				  {percentage}%
				</Text>
			  );
			} else {
			  return (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
				  N/A
				</Text>
			  );
			}
		},
		}),
		columnHelper.accessor('score', {
		  // ... (previous configuration)
		  cell: (cell) => (
			<Text color={textColor} fontSize='sm' fontWeight='700'>
			  {result.getGameList[cell.row.index]?.gameTotalScore}
			</Text>
		  ),
		}),
		columnHelper.accessor('date', {
		  // ... (previous configuration)
		  cell: (cell) => (
			<Text color={textColor} fontSize='sm' fontWeight='700'>
			  {result.getGameList[cell.row.index]?.createdAt}
			</Text>
		  ),
		}),
	  ];
	const [data, setData] = React.useState(() => [...defaultData]);
	const table = useReactTable({
	  data,
	  columns,
	  state: {
		sorting,
	  },
	  onSortingChange: setSorting,
	  getCoreRowModel: getCoreRowModel(),
	  getSortedRowModel: getSortedRowModel(),
	  debugTable: true,
	});
	return (
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					Check Table
				</Text>
				<Menu />
			</Flex>
			<Box>
				<Table variant='simple' color='gray.500' mb='24px' mt="12px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<Th
											key={header.id}
											colSpan={header.colSpan}
											pe='10px' 
											borderColor={borderColor}
											cursor='pointer'
											onClick={header.column.getToggleSortingHandler()}>
											<Flex
												justifyContent='space-between'
												align='center'
												fontSize={{ sm: '10px', lg: '12px' }}
												color='gray.400'>
												{flexRender(header.column.columnDef.header, header.getContext())}{{
													asc: '',
													desc: '',
												}[header.column.getIsSorted() as string] ?? null}
											</Flex>
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.slice(0, 5).map((row) => {
							return (
								<Tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td
												key={cell.id}
												fontSize={{ sm: '14px' }}
												minW={{ sm: '150px', md: '200px', lg: 'auto' }}
												borderColor='transparent'>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Box>
		</Card>
	);
} 