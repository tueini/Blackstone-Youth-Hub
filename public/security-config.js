const SECURE_AUTH_HASHES = {
    MASTER: "103a9f4c69d7331576e1a7b7f96ce781e3336f7b304424373aea1f263c581a3d",
    PRIMARY: "9c1c47542d570171d9953f582f23be44db285c72bf6546f18f1b64b8b722c52c",
    PRIESTS: "09ba81523ab766fd635e1a232b79e23856e64729e4f0d304c5fa85142752eb12",
    TEACHERS: "b38eac4d6c9b42822b4c52dbdd3096492f33b0cf911a5d1ee3d165a4bc690821",
    DEACONS: "6d37a35cbcc818aa814abc03856cd36d22cf059616d9785294d7a65eefa46186",
    YW: "f3e84ba1723f005ef7ee29cc8c5fb919d91d714b203de29ca3e3f51a34d9256c",
    COMBINED: "128d5d36e2f6946ce2a220fc84332da118d0429712a488c9eb4747a8efdb2d94"
};

const SPOTLIGHT_APPROVED_HASHES = [
    "49dc32d144254d01d855278512b3136d081d8b3e48635d1d2da759d7257432b2",
    "96a030ef7207224a71290eec8daa464481ba8eb4ec9db402efbbf751c513b52b",
    "3741d854a9685db18aeedf0d5d19738b625ba8af2786bcba1be1d45b5aa350f3",
    "c2665ea3e12568c37b740ffa21751b197aabf0a164a7ca562906bd7c094dde34",
    "56fe43f748e258de06b4955e2b8978bbc1c28ff9ba53917387d6dca8fb920018",
    "cab6b959431f0cf4e844d2d5c54f4cf4b568c335e19427fafcb5a9efda1b55cb",
    "7e73b026cfd1b008c5580cc3d1d65bf7e59e70f8fd934508c40ad473835ea22a",
    "162094c4d87101ff5aca2e655c39a40744052b4e1deb3f100391d45946db0bec"
];

async function hashInput(name) {
    const normalized = name.trim().toLowerCase();
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
