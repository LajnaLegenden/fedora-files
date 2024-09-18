import { Box, ModalOverlay } from "@chakra-ui/react"
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@northlight/ui"
import React, { useMemo } from "react"

export type UserScore = {
  name: string,
  _id: number,
  scores: number[]
}

type SheetTableProps = {
  userScores: UserScore[]
}
export function SheetTable({
  userScores
}: SheetTableProps) {

  const sortedUserScores = useMemo(() => {
    const withHighScore = userScores.map(userScore => {
      const highScore = Math.max(...userScore.scores)
      return {
        ...userScore,
        highScore
      }
    })
    //Sort by highScore
    return withHighScore.sort((a, b) => {
      return b.highScore - a.highScore
    })
  }, [userScores])


  return (<Box>
    <Table variant="rounded">
      <Thead>
        <Tr>
          <Th fontWeight="bold">Name</Th>
          <Th fontWeight="bold">Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedUserScores.map((userScore) => <TableRow key={userScore._id} userScore={userScore} highScore={userScore.highScore} />)}
      </Tbody>
    </Table>  </Box>)
}



function TableRow({ userScore, highScore }: { userScore: UserScore, highScore: number }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  //Copy array to avoid modifying prop
  const sortedHighscores = useMemo(() => {
    return [...userScore.scores].sort((a, b) => { return b - a })
  }, [userScore.scores.length])
  return (
    <>
      <Tr>
        <Td>{userScore.name}</Td>
        <Td>{highScore}</Td>
        <Td>
          <Button onClick={onOpen}>Show scores</Button>
        </Td>
        <Td> <Modal isOpen={isOpen} size={"2xl"} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>User scores</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="rounded">
                <Thead>
                  <Tr>
                    <Th fontWeight="bold">Score</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedHighscores.map(score => (<Tr key={score}><Td>{score}</Td></Tr>))}
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        </Td>
      </Tr>
    </>
  )
}
