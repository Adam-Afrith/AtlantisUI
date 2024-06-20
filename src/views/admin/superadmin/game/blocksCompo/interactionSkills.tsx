// Chakra imports
import { Flex, Box, FormLabel, Input, Tag, TagCloseButton, TagLabel, useColorModeValue } from '@chakra-ui/react';
// Custom components
import { useState, useEffect } from 'react';

function TagsField(props: {
	label?: string;
	id?: string;
	placeholderTags?: { name: string; id: number }[];
	[x: string]: any;

	onTagsChange?: (tags: { name: string; id: number }[], interaction: any) => void; // Accept two parameters

	interaction?: any;
	inputskill?: any;
}) {
	const { label, id, placeholderTags, onTagsChange, interaction, inputskill, ...rest } = props;
	let initialTags = [
		{
			name: 'set your siklls type and press enter',
			id: 1
		}
	];
	if (placeholderTags) initialTags = placeholderTags;
	const [tags, setTags] = useState(initialTags);



	useEffect(() => {
		if (inputskill) {
			// Split the string into an array of skills
			const skillsArray = inputskill?.split(',');
			if (skillsArray.length !== 0) {
				const skillsObjectsArray = skillsArray.map((skill: any, index: any) => ({
					name: skill,
					id: index + 1, // Assuming you want to start the id from 1
				}));
				setTags(skillsObjectsArray)
			}
			// Create an array of objects with 'name' and 'id' properties
		}
	}, [inputskill])


	const keyPress = (e: any) => {
		if (e.keyCode === 13) {
			const newTag = {
				name: e.target.value,
				id: tags.length === 0 ? 1 : tags[tags.length - 1].id + 1,
			};
			setTags([...tags, newTag]);
			if (onTagsChange) {
				onTagsChange([...tags, newTag], interaction); // Pass both parameters
			}
			e.target.value = '';
		}
	};

	let borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
	let bg = useColorModeValue('brand.500', 'brand.400');
	return (
		<Box>
			<FormLabel htmlFor={id} fontWeight='bold' fontSize='sm' mb='8px'>
				{label}
			</FormLabel>

			<Flex
				direction='row'
				p='12px'
				wrap='wrap'
				bg='transparent'
				border='1px solid'
				borderColor={borderColor}
				borderRadius='16px'
				_focus={{ borderColor: 'teal.300' }}
				minH='40px'
				h='stretch'
				cursor='text'
				{...rest}>
				<div style={{ width: '300px', height: '130px', overflow: 'auto' }}>
					{tags.map((tag, index) => {
						return (

							<Tag
								fontSize='xs'
								h='25px'
								mb='6px'
								me='6px'
								borderRadius='12px'
								variant='solid'
								bg={bg}
								key={index}>
								<TagLabel w='100%'>{tag.name}</TagLabel>
								<TagCloseButton
									justifySelf='flex-end'
									color='white'
									onClick={() => {
										const updatedTags = tags.filter((element) => element.id !== tag.id);
										setTags(updatedTags);
										onTagsChange(updatedTags, interaction); // Call the callback function to update parent state
									}}
								/>
							</Tag>
						);
					})}
					<Input
						variant='main'
						bg='transparent'
						border='none'
						p='0px'
						onKeyDown={(e) => keyPress(e)}
						fontSize='sm'
					/>
				</div>
			</Flex>

		</Box>
	);
}

export default TagsField;
