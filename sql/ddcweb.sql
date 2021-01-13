DROP TABLE IF EXISTS action;
drop table  attemptedLogin;
DROP TABLE IF EXISTS invite;

CREATE TABLE invite
(
    inviteId   BINARY(16)                          NOT NULL,
    username   VARCHAR(20)                         NOT NULL,
    fullName   VARCHAR(64)                         NOT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    browser    VARCHAR(512)                        NOT NULL,
    ip         VARBINARY(16)                       NOT NULL,
    INDEX (username),
    PRIMARY KEY (inviteId)
);

CREATE TABLE attemptedLogin
(
    attemptedLoginId       BINARY(16)                          NOT NULL,
    attemptedLoginUsername VARCHAR(32)                         NOT NULL,
    attemptedLoginResult VARCHAR(10) NOT NULL,
    createDate             TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip                     varchar(512)                       NOT NULL,
    browser                VARCHAR(512)                        NOT NULL,
    PRIMARY KEY (attemptedLoginId)
);
CREATE TABLE action
(
    actionId   BINARY(16)                          NOT NULL,
    inviteId   BINARY(16)                          NOT NULL,
    approved   TINYINT UNSIGNED                    NOT NULL,
    actionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actionUser VARCHAR(20)                         NOT NULL,
    UNIQUE (inviteId),
    FOREIGN KEY (inviteId) REFERENCES invite (inviteId),
    PRIMARY KEY (actionId)
);