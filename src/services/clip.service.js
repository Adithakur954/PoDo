export function createClipPlan(input) {
    const { totalDuration, clipDuration } = input;
    const totalClips = Math.ceil(totalDuration / clipDuration);
    const clips = [];
    for (let part = 0; part < totalClips; part++) {
        const start = part * clipDuration;
        const end = Math.min(start + clipDuration, totalDuration);
        const duration = end - start;
        clips.push({
            part: part + 1,
            start,
            end,
            duration
        });
    }
    return {
        ...input,
        totalClips,
        clips
    };
}
//# sourceMappingURL=clip.service.js.map