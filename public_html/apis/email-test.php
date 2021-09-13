<?php
require_once(dirname(__DIR__, 2) . "/php/lib/mailer.php");
try{
    sendEmail("no_reply_ddfullstack@cnm.edu", "DD Fullstack", "g.e.kephart@gmail.com", "George Kephart", "Testing", "This is a test");

} catch (\Exception | TypeError | InvalidArgumentException | RuntimeException | Error $exception) {
    echo $exception->getMessage();
}
