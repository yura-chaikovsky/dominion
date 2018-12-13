module.exports = {

    subject: "Forgot your Password?",

    body: `Dear friend,<br /><br />

Forgot your account password? No worries, click the link below to set a new one.<br /><br /> 

<a href="[server-host]/auth/reset-password?accounts_id=[accounts-id]&token=[session-token]">
[server-host]/auth/reset-password?accounts_id=[accounts-id]&token=[session-token]
</a><br /><br />

Didn't request this change? Simply ignore this email and your password will remain the same.<br /><br />

`
};