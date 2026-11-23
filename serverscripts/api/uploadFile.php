<?php
// Disabled: this endpoint accepted any file (also scripts) into the web root without checks.
// Golden Shot photos are uploaded through Strapi now (POST /api/golden-shot-registrations/register).
// Delete this file on the server.
http_response_code(410);
header('Content-Type: text/plain; charset=utf-8');
echo 'Gone';
