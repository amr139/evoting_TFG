TEST=$1

if [[ "$TEST" == "both" ]]; then
rm -r wallet;
node enrollAdmin.js;
node registerWebClient.js;
node registerTester.js;
cp -rf wallet/webClient.id ~/web2nodejs/webserver/app/utils/key/webClient.id
cp -rf ../organizations/peerOrganizations/org1.example.com/connection-org1.json ~/web2nodejs/webserver/app/utils/key/connection.json
node test1.js;
node test2.js;
node test3.js;
node test4.js;
node test5.js;
node test6.js;
node test7.js
elif [[ "$TEST" == "init" ]]; then
rm -r wallet;
node enrollAdmin.js;
node registerWebClient.js;
node registerTester.js;
cp -rf wallet/webClient.id ~/web2nodejs/webserver/app/utils/key/webClient.id
cp -rf ../organizations/peerOrganizations/org1.example.com/connection-org1.json ~/web2nodejs/webserver/app/utils/key/connection.json
else
node test1.js;
node test2.js;
node test3.js;
node test4.js;
node test5.js;
node test6.js;
node test7.js;
fi
