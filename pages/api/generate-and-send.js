import * as DropboxSign from "@dropbox/sign";

const signatureRequestApi = new DropboxSign.SignatureRequestApi();


export default async function handler(req, res) {
    signatureRequestApi.username = process.env.DROPBOX_SIGN_API_KEY;

    const body = JSON.parse(req.body)

    console.log(body)

    let attendeeList = []
    body.data.forEach((attendee) => {

        const attendeeDetails = {
            role: "Attendee",
            name: attendee.attendeeName,
            emailAddress: attendee.attendeeEmail
        }

        const attendeeCustomFields = {
            name: "Address",
            value: attendee.attendeeAddress
        }

        const signerObject = {
            signers: [ attendeeDetails ],
            customFields: [ attendeeCustomFields ]
        }

        attendeeList.push(signerObject)
    })

    const data = {
        templateIds: [ body.templateId ],
        subject: "Liability Waiver",
        message: "Please sign this waiver to attend the event",
        signerList: attendeeList,
        testMode: true,
    };


    console.log(JSON.stringify(data))


    const result = signatureRequestApi.signatureRequestBulkSendWithTemplate(data);
    result.then(response => {
        console.log(response.body);
        res.status(200).json({success: true, message: 'Documents sent successfully'})
    }).catch(error => {
        console.log("Exception when calling Dropbox Sign API:");
        console.log(error.body);
        res.status(500).json({success: false, message: 'An error occured'})
    });

}

export const config = {
    api: {
        bodyParser: true,
    },
};