import { Button, Link } from '@chakra-ui/react'
import { palette } from '@northlight/tokens'
import {
  Box,
  Container,
  Form,
  H1,
  H2,
  HStack,
  NumberInputField,
  P,
  TextField,
  VStack
} from '@northlight/ui'
import React, { ReactNode, useState } from 'react'
import { SheetTable, UserScore } from './components/UserScoreTable'
import { ExcelDropzone, ExcelRow } from './excel-dropzone.jsx'
import scores from './scores'
import users from './users'
interface ExternalLinkProps {
  href: string,
  children: ReactNode,
}

const ExternalLink = ({ href, children }: ExternalLinkProps) => <Link href={href} isExternal sx={{ color: palette.blue['500'], textDecoration: 'underline' }}>{children}</Link>


// Calculate this outside fuction to ensure it runs once
const initialData: UserScore[] = []
for (const user of users) {
  initialData.push({
    ...user,
    scores: scores.filter(score => score.userId === user._id).map(score => score.score)
  })
}

export default function App() {
  const [userScores, setUserScores] = useState<UserScore[]>(initialData)

  function handleSheetData(data: ExcelRow[]) {
    const newSheetData: UserScore[] = data.reduce<UserScore[]>((acc, currentValue) => {
      if (!currentValue.score === undefined || !currentValue.name === undefined) return acc
      return addData(currentValue.name, currentValue.score, acc)
    }, userScores)
    setUserScores(newSheetData)
  }

  const addData = (name: string, score: number, _arr: UserScore[]) => {
    //Copy array to ensure that react handles memo
    const arr = [..._arr]
    // Maybe use an id instead to handle multiple with the same name
    // Add score to userscore, if they exists, else creaate a new with random id
    const nameIndex = arr.findIndex(el => el.name === name)
    if (nameIndex === -1) {
      arr.push({
        _id: Math.floor(Math.random() * 1000 + 1000),
        name: name,
        scores: [score]
      })
    } else {
      arr[nameIndex].scores.push(score)
    }
    return arr
  }
  return (
    <Container maxW="6xl" padding="4">
      <H1 marginBottom="4" >Mediatool exercise</H1>
      <HStack spacing={10} align="flex-start">
        <ExcelDropzone
          onSheetDrop={handleSheetData}
          label="Import excel file here"
        />
        <VStack align="left">
          <Box>
            <H2>Initial site</H2>
            <P>
              Drop the excel file scores.xlsx that you will find
              in this repo in the area to the left and watch the log output in the console.
              We hope this is enough to get you started with the import.
            </P>
          </Box>
          <Box>
            <H2>Styling and Northlight</H2>
            <P>
              Styling is optional for this task and not a requirement. The styling for this app is using
              our own library Northligth which in turn is based on Chakra UI.
              You <i>may</i> use it to give some style to the application but again, it is entierly optional.
            </P>
            <P>
              Checkout <ExternalLink href="https://chakra-ui.com/">Chackra UI</ExternalLink> for
              layout components such
              as <ExternalLink href="https://chakra-ui.com/docs/components/box">Box</ExternalLink>
              , <ExternalLink href="https://chakra-ui.com/docs/components/stack">Stack</ExternalLink>
              , <ExternalLink href="https://chakra-ui.com/docs/components/grid">Grid</ExternalLink>
              , <ExternalLink href="https://chakra-ui.com/docs/components/flex">Flex</ExternalLink> and others.
            </P>
            <P>
              Checkout <ExternalLink href="https://northlight.dev/">Northlight</ExternalLink> for
              some of our components.
            </P>
          </Box>
        </VStack>
      </HStack>
      <Box>
        <Form
          initialValues={{ name: '', score: 0 }}
          onSubmit={(values) => {
            setUserScores(addData(values.name, values.score, userScores))
          }}
          formSettings={{
            mode: 'onSubmit',
          }}
        >
          <HStack mb={4} alignItems="end">
            <TextField
              name="name"
              label="Name"
              isRequired={true}
            />
            <NumberInputField name='score' label='Score' isRequired={true} />
            <Button type="submit" variant="success">Add</Button>
          </HStack>
        </Form>
      </Box>
      <SheetTable userScores={userScores} />
    </Container>
  )
}
