import {Inter} from 'next/font/google'
import {Button, Heading, HStack, IconButton, Input, Select, useToast, VStack} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

export default function Home() {
    const toast = useToast()

    const [formData, setFormData] = useState([{
        attendeeName: "",
        attendeeEmail: "",
        attendeeAddress: "",
    }])

    const [templates, setTemplates] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState("")

    const onSendClick = () => {
        if (formData.length === 0)
            toast({
                title: 'No data provided',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })

        if (formData[0].attendeeEmail === "")
            toast({
                title: 'Email can not be empty',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })

        fetch('/api/generate-and-send', {
            method: "POST",
            body: JSON.stringify({templateId: selectedTemplate, data: formData})
        })
    }

    useEffect(() => {
        fetch('/api/list-templates')
            .then(r => r.json())
            .then(r => {
                setTemplates(r)
                toast({
                    title: 'Templates loaded!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            })
    }, [])

    return (
        <VStack spacing={10} margin={10}>
            <Heading>Generate & Send Documents</Heading>

            <Select placeholder='Choose template' width={400} value={selectedTemplate}
                    onChange={ev => setSelectedTemplate(ev.target.value)}>
                {templates.map(template => <option value={template.id}>{template.name}</option>)}
            </Select>

            {formData.map(
                (row, index) => <InputGroup
                    attendeeName={row.attendeeName}
                    attendeeEmail={row.attendeeEmail}
                    attendeeAddress={row.attendeeAddress}
                    setAttendeeName={(value) => {
                        let tempFormData = [...formData]
                        tempFormData[index].attendeeName = value
                        setFormData(tempFormData)
                    }}
                    setAttendeeEmail={(value) => {
                        let tempFormData = [...formData]
                        tempFormData[index].attendeeEmail = value
                        setFormData(tempFormData)
                    }}
                    setAttendeeAddress={(value) => {
                        let tempFormData = [...formData]
                        tempFormData[index].attendeeAddress = value
                        setFormData(tempFormData)
                    }}
                    deleteRow={() => {
                        setFormData(
                            formData.filter((currRow, currIndex) => (
                                index !== currIndex
                            ))
                        )
                    }}/>)}

            <Button onClick={() => {
                setFormData([
                    ...formData,
                    {
                        attendeeName: "",
                        attendeeEmail: "",
                        attendeeAddress: "",
                    }
                ])
            }}>Add More</Button>

            <Button onClick={onSendClick} colorScheme='blue'>Generate & Send</Button>
        </VStack>
    )
}

const InputGroup = ({
                        attendeeName,
                        setAttendeeName,
                        attendeeEmail,
                        setAttendeeEmail,
                        attendeeAddress,
                        setAttendeeAddress,
                        deleteRow
                    }) => {
    return <>
        <HStack spacing={3}>
            <Input variant='filled' value={attendeeName} onChange={ev => setAttendeeName(ev.target.value)}
                   placeholder='Attendee Name'/>
            <Input variant='filled' value={attendeeEmail} onChange={ev => setAttendeeEmail(ev.target.value)}
                   placeholder='Attendee Email'/>
            <Input variant='filled' value={attendeeAddress} onChange={ev => setAttendeeAddress(ev.target.value)}
                   placeholder='Attendee Address'/>
            <IconButton aria-label={'Delete row'} icon={<CloseIcon/>} onClick={deleteRow}/>
        </HStack>
    </>
}
