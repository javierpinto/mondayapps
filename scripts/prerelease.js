#!/usr/bin/env node

const execa = require("execa");

function getVersionPreid() {
  const branchName = process.argv.find(arg => arg.startsWith("--branch-name=")).substring(9);

  // Find the last occurrence of the '/' character
  const index = branchName.lastIndexOf("/");

  // If the character was found, return the substring after it
  if (index !== -1) {
    return branchName.substring(index + 1);
  }

  // If the character was not found, return the original string
  return branchName;
}

function bumpVersion(branchName) {
  const preid = getVersionPreid(branchName);
  execa.sync("npm", ["version", "prerelease", `--preid=${preid}`]);
}

bumpVersion();