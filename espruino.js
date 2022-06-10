const dgram = require('dgram');
const http = require('http');
const wifi = require('Wifi');

let device = {};
let ipaddress;

const deviceSerial = () => {
  const chars = '0123456789abcdef'.split('');
  let rawserial = '';
  for (let i = 0; i < 32; i++) {
    rawserial += chars[Math.ceil(Math.random() * 15)];
  }

  return rawserial.substring(0, 8) + '-' + rawserial.substring(8, 12) + '-' + rawserial.substring(12, 16) + '-' + rawserial.substring(16, 20) + '-' + rawserial.substring(20, 32);
};


const response = (ipaddr) => ([
  'HTTP/1.1 200 OK',
  'CACHE-CONTROL: max-age=86400',
  'DATE: ' + (new Date()).toUTCString(),
  'EXT:',
  'LOCATION: http://' + ipaddr + ':' + device.port + '/setup.xml',
  'OPT: "http://schemas.upnp.org/upnp/1/0/"; ns=01',
  '01-NLS: ' + device.serial + '',
  'SERVER: Unspecified, UPnP/1.0, Unspecified',
  'X-User-Agent: redsonic',
  'ST: urn:Belkin:service:basicevent:1',
  'USN: uuid:Socket-' + device.serial + '::urn:Belkin:service:basicevent:1'
].join('\r\n') + '\r\n\r\n');

const parseHeaders = (message) => {
  const lines = message.toString().split('\r\n');

  if (lines[0] == "M-SEARCH * HTTP/1.1") {
    let headers = {};
    for (let i = 1; i <= lines.length - 1; i++) {
      if (lines[i] == ''); else {
        let header = lines[i].split(': ');
        headers[header[0]] = header[1];
      }
    }
    return headers;
  } else {
    return false;
  }
};


const getState = (callback) => {
  if (device.hasOwnProperty('statusHandler')) {
    device.statusHandler(function (status) {
      callback(status);
    });
  } else {
    callback(device.state);
  }
};

const setState = (state) => {
  device.state = state;
  device.handler(state);
};

function startWebServer (fauxMo) {
  const server = http.createServer(function (request, response) {
    if (request.method == 'POST') {
      let body = '';
      request.on('data', (chunk) => {
        //consider adding size limit here
        body += chunk.toString();
      });

      request.on('end', () => {
        let soapaction = request.headers.SOAPACTION.split('#')[1];
        let action = soapaction.substring(0, soapaction.length - 1);
        let xmlresponse;

        getState(function (state) {
          if (action == "GetBinaryState") {
            xmlresponse = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <s:Body>
                <u:GetBinaryStateResponse xmlns:u="urn:Belkin:service:basicevent:1">
                  <BinaryState>` + state + `</BinaryState>
                </u:GetBinaryStateResponse>
                </s:Body>
              </s:Envelope>`;
          } else if (action == "SetBinaryState") {
            let searchstr = body.indexOf('</BinaryState>');
            let statereq = body.substring(searchstr - 1, searchstr);
            setState(parseInt(statereq));
            xmlresponse = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <s:Body>
                <u:SetBinaryStateResponse xmlns:u="urn:Belkin:service:basicevent:1">
                <CountdownEndTime>0</CountdownEndTime>
                </u:SetBinaryStateResponse>
              </s:Body>
            </s:Envelope>`;
          }
          response.writeHead(200, {
            'Content-Length': xmlresponse.length,
            'Content-Type': 'text/xml',
            SOAPACTION: 'urn:Belkin:service:basicevent:1#SetBinaryStateResponse',
          });
          response.end(xmlresponse);
        });
      });
    } else if (request.method == 'GET') {
      if (request.url == '/setup.xml') {
        let xml = `<?xml version="1.0"?>
          <root>
            <device>
            <deviceType>urn:Belkin:device:controllee:1</deviceType>
            <friendlyName>` + device.name + `</friendlyName>
            <manufacturer>Belkin International Inc.</manufacturer>
            <manufacturerURL>http://www.belkin.com</manufacturerURL>
            <modelDescription>Belkin Plugin Socket 1.0</modelDescription>
            <modelName>Socket</modelName>
            <modelNumber>1.0</modelNumber>
            <serialNumber>` + device.serial + `</serialNumber>
            <UDN>uuid:Socket-1_0-` + device.serial + `</UDN>
            <macAddress>000000000000</macAddress>
            <firmwareVersion>WeMo_WW_2.00.11143.PVT-OWRT-SNSV2</firmwareVersion>
            <iconList>
              <icon>
              <mimetype>jpg</mimetype>
              <width>100</width>
              <height>100</height>
              <depth>100</depth>
               <url>icon.jpg</url>
              </icon>
            </iconList>
            <serviceList>
              <service>
                <serviceType>urn:Belkin:service:WiFiSetup:1</serviceType>
                <serviceId>urn:Belkin:serviceId:WiFiSetup1</serviceId>
                <controlURL>/upnp/control/WiFiSetup1</controlURL>
                <eventSubURL>/upnp/event/WiFiSetup1</eventSubURL>
                <SCPDURL>/setupservice.xml</SCPDURL>
              </service>
              <service>
                <serviceType>urn:Belkin:service:basicevent:1</serviceType>
                <serviceId>urn:Belkin:serviceId:basicevent1</serviceId>
                <controlURL>/upnp/control/basicevent1</controlURL>
                <eventSubURL>/upnp/event/basicevent1</eventSubURL>
                <SCPDURL>/eventservice.xml</SCPDURL>
              </service>
            </serviceList>
             <presentationURL>/pluginpres.html</presentationURL>
            </device>
          </root>`;
        response.writeHead(200, {
          'Content-Length': xml.length,
          'Content-Type': 'text/xml',
          SOAPACTION: 'urn:Belkin:service:basicevent:1#GetBinaryStateResponse',
        });
        response.end(xml);
      } else {
        console.log('Unhandled http ' + request.method + ' request ' + request.url);
        response.end('Hello Node.js Server!');
      }
    } else {
      //console.log('Unhandled http ' + request.method + ' request ' + request.url);
      //console.log(request.headers);
      response.end('Hello Node.js Server!');
    }
  });

  server.listen(device.port, (err) => {
    if (err) {
      return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
  });
}


function startSSDPServer (fauxMo) {
  if (!fauxMo.hasOwnProperty('ipAddress')) {
    throw new Error('Missing device IP address');
  } else {
    ipaddress = fauxMo.ipAddress;
  }

  const udpServer = dgram.createSocket({
    type: 'udp4',
    reuseAddr: true,
    multicastGroup: '239.255.255.250'
  });

  udpServer.on('error', (err) => {
    console.log('UDP server error: ', err);
    throw err;
  });

  udpServer.on('message', (msg, rinfo) => {
    const search = parseHeaders(msg);
    if (search) {
      const srcip = ipaddress;
      const resp = response(srcip);

      udpServer.send(resp, 0, resp.length, rinfo.port, rinfo.address);
    }
  });

  udpServer.on('listening', () => {
    try {
      udpServer.addMembership('239.255.255.250', ipaddress);
    } catch (err) {
      console.log(`UDP server error: ${err.message}`);
    }
  });

  udpServer.bind(1900);
}

const FauxMo = function (fauxMo) {
  device = fauxMo.device;
  device.state = 0;
  device.serial = deviceSerial();

  startSSDPServer(fauxMo);
  startWebServer(fauxMo);
};

wifi.getIP((err, ip) => {
  if (err) {
    throw new Error('Cant determine mac address');
  }
  wifi.connect('Sychevalnia 2.4GHz', { password: 'Kamenshikov' }, conErr => {
    if (conErr) {
      throw new Error(conErr);
    }
    wifi.getIP((ipErr, ip) => {
      if (ipErr) {
        throw new Error('Cant determine ip address');
      }
      new FauxMo({
        ipAddress: ip.ip,
        device: {
          name: 'Plug',
          port: 11000,
          handler: function (action) {
            D4.write(action);
          }
        }
      });
    });
  });
});
