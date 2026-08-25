import {IGuildsMembersRead} from '../types';

interface GetUserDisplayNameArgs {
  guildMember: IGuildsMembersRead | null;
  // Only the fields this function actually reads -- narrower than
  // Partial<Types.User>, which pulls in avatar_decoration_data typing that
  // isn't consistent between the SDK's exported Types.User and the shape
  // some event payloads (e.g. ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE) send.
  user: {
    username: string;
    discriminator: string;
    global_name?: string | null;
  };
}

export function getUserDisplayName({guildMember, user}: GetUserDisplayNameArgs) {
  if (guildMember?.nick != null && guildMember.nick !== '') return guildMember.nick;

  if (user.discriminator !== '0') return `${user.username}#${user.discriminator}`;

  if (user.global_name != null && user.global_name !== '') return user.global_name;

  return user.username;
}
