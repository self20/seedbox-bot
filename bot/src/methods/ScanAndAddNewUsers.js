import fs from "fs";
import { UserTaskCollection } from "../components/UserTaskManager";
import { User } from "../models/User";
import { UserTask } from "./UserTask";
import { RssFeedTorrent, status as RssFeedTorrentStatus } from "../models/RssFeedTorrent";
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

async function ScanAndAddNewUsers() {
  let allUsers;
  let existingUserIds = UserTaskCollection.map(_ => _.user_id);
  allUsers = await User.findAll();
  allUsers.forEach(async user => {
    if (existingUserIds.indexOf(user.id) >= 0) return;
    let userTask = new UserTask(user.id);
    let pendingAddTorrents = await RssFeedTorrent.findAll({
      where: {
        [Op.or]: [
          {
            status: RssFeedTorrentStatus.PENDING_DOWNLOAD,
          }, {
            status: RssFeedTorrentStatus.PENDING_ADD,
          },
        ],
      },
    });
    for (let i = 0; i < pendingAddTorrents.length; i++) {
      await pendingAddTorrents[i].destroy();
    }
    UserTaskCollection.push(userTask);
    userTask.start();
  });
}

export { ScanAndAddNewUsers };