import React, { useRef, useState, useEffect } from 'react';
import Janus from './utils/janus';

const JanusComponent = ({ children, server, iceUrls, turnServer, turnUser, turnPassword }) => {
    const janusEl = useRef(null);
    const [janusInstance, setJanusInstance] = useState(null);

    useEffect(() => {

        Janus.init({debug: "all", callback: function() {
            if(!Janus.isWebrtcSupported()) {
				console.log("No WebRTC support... ");
				return;
            }
            const iceServers = [{
                urls: iceUrls
            }];
            if (turnServer) {
                iceServers.push({
                    urls: turnServer, username: turnUser, credential: turnPassword
                })
            }
            const janus = new Janus(
				{
					server: server,
					iceServers,
					// Should the Janus API require authentication, you can specify either the API secret or user token here too
					//		token: "mytoken",
					//	or
					//		apisecret: "serversecret",
					success: function() {
						// Attach to echo test plugin
                        setJanusInstance(janus);
					},
					error: function(error) {
						Janus.error(error);
                        setJanusInstance(null);
					},
					destroyed: function() {
                        setJanusInstance(null);
					}
                });
        }});

    }, [])
    
    return (
        <div className="janus-container" ref={janusEl}>
            {children &&
                children.length && 
                    children.map((child, i) => (
                        React.cloneElement(child, { janus: janusInstance, key: i })
                    ))
            }
            {children &&
                !children.length && 
                    React.cloneElement(children, { janus: janusInstance })
            }    
        </div>
    );
}

export default JanusComponent;