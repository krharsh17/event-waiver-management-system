import * as DropboxSign from "@dropbox/sign";


export default function handler(req, res) {


    const accountApi = new DropboxSign.AccountApi();
    accountApi.username = process.env.DROPBOX_SIGN_API_KEY;
    const result = accountApi.accountGet(undefined, process.env.DROPBOX_SIGN_ACCOUNT_EMAIL_ADDRESS);

    result.then(response => {

        const accountId = response.body.account.accountId
        const templateApi = new DropboxSign.TemplateApi();
        templateApi.username = process.env.DROPBOX_SIGN_API_KEY;
        const result = templateApi.templateList(accountId);

        result.then(response => {
            res.status(200).json(response.body.templates.map(template =>
                ({
                    id: template.templateId,
                    name: template.title
                })
            ))
        }).catch(error => {
            console.log("Exception when calling Dropbox Sign API:");
            console.log(error.body);
        });
    }).catch(error => {
        console.log("Exception when calling Dropbox Sign API:");
        console.log(error.body);
    });
}
