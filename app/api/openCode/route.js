import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET(request) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    // Path to your project folder
    // Dynamically get the project folder path
    const projectPath = process.cwd();

    // Command to open the folder in OS file explorer.
    // On Windows use explorer, on macOS use open, on Linux use xdg-open.
    let command;
    if (process.platform === 'win32') {
        // Use double quotes to handle spaces in path
        command = `explorer "${projectPath}"`;
    } else if (process.platform === 'darwin') {
        command = `open "${projectPath}"`;
    } else {
        command = `xdg-open "${projectPath}"`;
    }

    return new Promise((resolve) => {
        exec(command, (error) => {
            if (error) {
                resolve(NextResponse.json({ error: error.message }, { status: 500 }));
            } else {
                resolve(NextResponse.json({ success: true }));
            }
        });
    });
}