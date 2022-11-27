import path from "path";
import { readFileSync } from "fs";

import yaml from "js-yaml";

import checkAndCopyConfig from "utils/config/config";

export default function getDockerArguments(server) {
  checkAndCopyConfig("docker.yaml");

  const configFile = path.join(process.cwd(), "config", "docker.yaml");
  const configData = readFileSync(configFile, "utf8");
  const servers = yaml.load(configData);

  if (!server) {
    if (process.platform !== "win32" && process.platform !== "darwin") {
      return { socketPath: "/var/run/docker.sock", swarm: false };
    }

    return { host: "127.0.0.1", swarm: false };
  }

  if (servers[server]) {
    if (servers[server].socket) {
      return { socketPath: servers[server].socket, swarm: servers[server].swarm };
    }

    if (servers[server].host) {
      return { host: servers[server].host, port: servers[server].port || null, swarm: servers[server].swarm };
    }

    return servers[server];
  }
  return null;
}
