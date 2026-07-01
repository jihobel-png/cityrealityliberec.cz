<?php
declare(strict_types=1);

const CONTACT_RECIPIENT = 'info@cityrealityliberec.cz';
const CONTACT_SENDER = 'info@cityrealityliberec.cz';

if (function_exists('mb_internal_encoding')) {
    mb_internal_encoding('UTF-8');
}

function wants_json(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $requestedWith = strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '');

    return strpos($accept, 'application/json') !== false || $requestedWith === 'xmlhttprequest';
}

function respond(int $status, bool $success, string $message): void
{
    http_response_code($status);

    if (wants_json()) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => $success,
            'message' => $message,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $safeMessage = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeTitle = $success ? 'Zpráva odeslána' : 'Zprávu se nepodařilo odeslat';

    header('Content-Type: text/html; charset=UTF-8');
    echo '<!doctype html><html lang="cs"><head><meta charset="UTF-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    echo '<title>' . $safeTitle . ' — City Reality Liberec</title>';
    echo '<style>body{margin:0;font-family:Arial,sans-serif;background:#fbfaf6;color:#1b2118;display:grid;min-height:100vh;place-items:center}main{max-width:680px;padding:42px;background:#fff;border-radius:28px;box-shadow:0 20px 55px rgba(30,34,27,.08)}a{color:#183a2d;font-weight:700}</style>';
    echo '</head><body><main><h1>' . $safeTitle . '</h1><p>' . $safeMessage . '</p><p><a href="../index.html#kontakt">Zpět na web</a></p></main></body></html>';
    exit;
}

function clean_input(string $key, int $maxLength = 1500): string
{
    $value = (string) ($_POST[$key] ?? '');
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[^\P{C}\n\t]/u', '', $value) ?? '';
    $value = trim($value);

    if (function_exists('mb_strlen') && function_exists('mb_substr')) {
        return mb_strlen($value) > $maxLength ? mb_substr($value, 0, $maxLength) : $value;
    }

    return strlen($value) > $maxLength ? substr($value, 0, $maxLength) : $value;
}

function one_line(string $value): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $value) ?? '');
}

function encoded_header_text(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Formulář je možné odeslat pouze metodou POST.');
}

$honeypot = clean_input('website', 200);
if ($honeypot !== '') {
    respond(200, true, 'Děkujeme, zpráva byla přijata. Ozveme se vám co nejdříve.');
}

$startedAt = clean_input('formStartedAt', 60);
if ($startedAt !== '') {
    $startedTimestamp = strtotime($startedAt);
    if ($startedTimestamp !== false && time() - $startedTimestamp < 2) {
        respond(200, true, 'Děkujeme, zpráva byla přijata. Ozveme se vám co nejdříve.');
    }
}

$name = one_line(clean_input('name', 90));
$phone = one_line(clean_input('phone', 30));
$email = one_line(clean_input('email', 120));
$interest = one_line(clean_input('interest', 120));
$message = clean_input('message', 1500);
$source = one_line(clean_input('source', 140));
$privacy = isset($_POST['privacy']);

if ($name === '' || $email === '' || $interest === '' || !$privacy) {
    respond(422, false, 'Doplňte prosím jméno, e-mail, typ dotazu a potvrzení zásad osobních údajů.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Zadaný e-mail nemá platný formát.');
}

if ($phone !== '' && !preg_match('/^[+0-9 ()-]{6,30}$/', $phone)) {
    respond(422, false, 'Zadaný telefon nemá platný formát.');
}

if ($message === '') {
    $message = 'Bez další zprávy.';
}

$submittedAt = date('c');
$ipAddress = one_line($_SERVER['REMOTE_ADDR'] ?? 'nezjištěno');
$userAgent = one_line($_SERVER['HTTP_USER_AGENT'] ?? 'nezjištěno');

$mailBody = implode("\n", [
    'Nová poptávka z webu City Reality Liberec',
    '',
    'Jméno: ' . $name,
    'Telefon: ' . ($phone !== '' ? $phone : 'neuveden'),
    'E-mail: ' . $email,
    'Zájem: ' . $interest,
    '',
    'Zpráva:',
    $message,
    '',
    'Souhlas se zpracováním osobních údajů: ano',
    'Zdroj: ' . ($source !== '' ? $source : 'kontaktní formulář'),
    'Odesláno: ' . $submittedAt,
    'IP adresa: ' . $ipAddress,
    'Prohlížeč: ' . $userAgent,
]);

$subject = 'Poptávka z webu — ' . $interest;
$encodedSubject = encoded_header_text($subject);
$encodedName = encoded_header_text($name);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: City Reality Liberec <' . CONTACT_SENDER . '>',
    'Reply-To: ' . $encodedName . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
];

if (!function_exists('mail')) {
    respond(500, false, 'Server nepodporuje odesílání e-mailů. Kontaktujte nás prosím přímo na info@cityrealityliberec.cz.');
}

$sent = @mail(CONTACT_RECIPIENT, $encodedSubject, $mailBody, implode("\r\n", $headers), '-f ' . CONTACT_SENDER);
if (!$sent) {
    $sent = @mail(CONTACT_RECIPIENT, $encodedSubject, $mailBody, implode("\r\n", $headers));
}

if (!$sent) {
    respond(500, false, 'Zprávu se nepodařilo odeslat. Kontaktujte nás prosím přímo na info@cityrealityliberec.cz.');
}

respond(200, true, 'Děkujeme, poptávka byla odeslána. Ozveme se vám co nejdříve.');
